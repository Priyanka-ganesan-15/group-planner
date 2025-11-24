import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthRoute =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/signup");

  const isInviteRoute = req.nextUrl.pathname.startsWith("/invite");

  const isDashboardRoute =
    !isInviteRoute &&
    (req.nextUrl.pathname === "/" ||
      req.nextUrl.pathname.startsWith("/events") ||
      req.nextUrl.pathname.startsWith("/tasks") ||
      req.nextUrl.pathname.startsWith("/members"));

  if (!user && isDashboardRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ["/", "/events/:path*", "/tasks/:path*", "/members/:path*", "/login", "/signup", "/invite/:path*"],
};
