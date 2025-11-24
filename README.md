# Group Planner

A collaborative planning dashboard for friend groups built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Icons:** Lucide React
- **State:** Mock data (frontend-only MVP)

## 📁 Project Structure

```
group-planner/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Overview
│   │   │   ├── events/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── tasks/page.tsx
│   │   │   └── members/page.tsx
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx           # Desktop navigation
│   │   │   ├── Topbar.tsx            # Top bar with event switcher
│   │   │   └── MobileNav.tsx         # Mobile bottom nav
│   │   ├── events/
│   │   │   └── EventCard.tsx
│   │   ├── tasks/
│   │   │   ├── TaskBoard.tsx         # Kanban board
│   │   │   └── TaskCard.tsx
│   │   └── ui/                       # shadcn/ui components
│   ├── lib/
│   │   ├── mockData.ts               # Mock events & tasks
│   │   └── utils.ts                  # cn() helper
│   └── types/
│       └── index.ts                  # TypeScript types
├── components.json
├── tailwind.config.ts
└── package.json
```

## 🎨 Features

- ✅ **Responsive Design:** Desktop sidebar + mobile bottom navigation
- ✅ **Dashboard Overview:** Event info, task progress, members at a glance
- ✅ **Event Management:** View and switch between multiple events
- ✅ **Task Board:** Kanban-style board (To do, Doing, Done)
- ✅ **Member Management:** See all participants
- ✅ **Auth Pages:** Login & signup UI (no backend yet)
- ✅ **Dark Mode Ready:** Tailwind CSS custom properties
- ✅ **Type-Safe:** Full TypeScript coverage

## 🚦 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📄 Routes

- `/` - Overview dashboard
- `/events` - List of all events
- `/events/[id]` - Single event view
- `/tasks` - Task board (Kanban)
- `/members` - Member list
- `/login` - Login page
- `/signup` - Signup page

## 🔮 Next Steps

This is a frontend-only MVP. Future enhancements:

- Backend API integration
- Database (PostgreSQL/MongoDB)
- Authentication (NextAuth.js)
- Real-time updates (WebSockets)
- Event creation & editing
- Task assignment & updates
- Member invitations
- File uploads
- Calendar integration

## 📝 Notes

- All data is currently mocked in `src/lib/mockData.ts`
- No backend or API routes yet
- Components use shadcn/ui for consistent styling
- Mobile-first responsive design

---

Built with ❤️ using Next.js 15
