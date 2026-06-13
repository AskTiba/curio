import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function proxy(request: NextRequest) {
  const supabaseResponse = await createClient(request);
  
  // We can extract the user state from the response cookies implicitly,
  // but the cleanest way is to just create a server client and check session
  // Luckily `createClient` already does `await supabase.auth.getUser()`
  // but we need to know the result. Let's do it explicitly.
  const { createServerClient } = await import("@supabase/ssr");
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll() {} // middleware handles it
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect dashboard routes
  const isDashboardRoute = ["/feed", "/saved", "/digest", "/discover"].some(
    path => request.nextUrl.pathname.startsWith(path)
  );

  if (isDashboardRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
