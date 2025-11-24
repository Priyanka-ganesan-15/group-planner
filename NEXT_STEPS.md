# Group Planner - Next Steps

## ✅ What's Been Completed

Your Next.js 15 group planning app is now fully wired with Supabase authentication and database! Here's what's working:

### Authentication
- Email/password sign up with user name
- Sign in/sign out with SSR cookie sessions
- Route protection via middleware
- User display in Topbar with logout

### Database Integration
- All dashboard pages now load from Supabase (no more mock data!)
- Events, Tasks, and Members all query real database tables
- Row Level Security (RLS) policies ensure users only see their own data
- Server Actions for creating/joining events

### Pages Updated
✅ `/events` - Lists your events with Create/Join forms
✅ `/events/[id]` - Single event dashboard with tasks
✅ `/tasks` - Tasks list for current event
✅ Overview dashboard - Shows event details, task progress, members
✅ Topbar - Event switcher loads from database

---

## 🚀 Critical: Run Database Schema

**Before testing the app, you MUST create the database tables!**

### Steps:
1. Go to https://supabase.com/dashboard
2. Select your project: `ttadcxfibnonlpbpuwci`
3. Click "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy the entire contents of `supabase-schema.sql`
6. Paste into the SQL editor
7. Click "Run" (or press Cmd+Enter)

You should see: ✅ Success. 3 tables created with RLS policies enabled.

---

## 🧪 Test the Full CRUD Flow

Once the schema is created, test these scenarios:

### 1. Create an Event
- Log in to the app
- Go to `/events`
- Fill out "Create New Event" form:
  - Title: "Weekend Trip"
  - Location: "Beach House"
  - Dates: Pick future dates
- Click "Create Event"
- Should redirect to `/events/[id]` showing your new event

### 2. Invite Someone
- On the event page, note the "Invite code" (e.g., `ABC123`)
- Sign out
- Create a new account with different email
- Go to `/events`
- Use "Join Event by Code" form
- Enter the invite code
- Should see the event appear in your list!

### 3. RLS Protection
- As user 2, try to view the event
- You should only see tasks/members for events you've joined
- Create a second event as user 2
- Switch back to user 1
- User 1 should NOT see user 2's second event

### 4. Task Management
- Go to `/tasks` or an event detail page
- Tasks are displayed but CREATE functionality isn't built yet
- Tasks are filtered by your current event

---

## 📝 What's Not Implemented Yet

These features are ready for you to build:

### Task CRUD
- **Create Task**: Add a form to create new tasks
- **Update Task**: Click to edit title, assign, change status
- **Delete Task**: Remove tasks
- **Drag & Drop**: Optional - reorder tasks on board

### Member Management
- **View Members**: `/members` page needs actual user data
  - Currently shows "Owner/Member" labels
  - Should show actual names from auth.users or user_metadata
- **Remove Members**: Event owners can kick members

### Additional Features
- **Edit Event**: Update event details (title, location, dates)
- **Delete Event**: Remove an event (owner only)
- **Task Comments**: Add discussion to tasks
- **File Uploads**: Attach files to tasks/events

---

## 🗄️ Database Schema Reference

### Tables Created

**`events`**
- `id` (uuid, primary key)
- `title`, `location`, `start_date`, `end_date`
- `invite_code` (unique, 6-char uppercase)
- `created_by` (user_id)
- `created_at`

**`event_members`**
- `event_id`, `user_id` (composite primary key)
- `is_owner` (boolean)
- `joined_at`

**`tasks`**
- `id` (uuid, primary key)
- `event_id` (foreign key)
- `title`, `description`, `assigned_to`
- `status` ("todo" | "in-progress" | "done")
- `priority` ("low" | "medium" | "high")
- `created_at`

### RLS Policies
- Users can only SELECT events they're a member of
- Users can only INSERT events (automatically become owner)
- Users can only UPDATE/DELETE events they own
- Tasks are tied to events (inherit event permissions)

---

## 🛠️ How to Add Task Creation

Here's a quick guide:

1. **Create Server Action** in `src/app/(dashboard)/events/[id]/actions.ts`:
```typescript
"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  const supabase = await createClient();
  const eventId = formData.get("eventId") as string;
  const title = formData.get("title") as string;
  
  await supabase.from("tasks").insert({
    event_id: eventId,
    title,
    status: "todo",
    priority: "medium"
  });
  
  revalidatePath(`/events/${eventId}`);
}
```

2. **Add Form** to the TaskBoard component:
```tsx
<form action={createTask}>
  <input type="hidden" name="eventId" value={eventId} />
  <input name="title" placeholder="New task..." />
  <button type="submit">Add Task</button>
</form>
```

3. **Test it** - create a task and see it appear instantly!

---

## 🔐 Environment Variables

Your `.env.local` is configured:
```
NEXT_PUBLIC_SUPABASE_URL=https://ttadcxfibnonlpbpuwci.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

These are needed for Supabase to work. Keep them secret!

---

## 📚 Key Files Reference

- **`src/lib/supabase/server.ts`** - Server-side Supabase client
- **`src/middleware.ts`** - Route protection
- **`src/lib/currentEvent.ts`** - Helper to get user's most recent event
- **`src/app/(dashboard)/events/actions.ts`** - createEvent, joinEvent
- **`supabase-schema.sql`** - Database schema (RUN THIS FIRST!)

---

## 🎉 You're All Set!

1. Run the SQL schema in Supabase dashboard
2. Start the dev server: `npm run dev`
3. Sign up with a test account
4. Create your first event
5. Start building! 🚀

Questions? Check the Next.js docs or Supabase docs for guidance.
