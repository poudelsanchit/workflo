import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request }); // Get the token for the user
  const { pathname } = request.nextUrl; // Extract the pathname

  // If the user is authenticated and tries to access "/", redirect to /app
  if (
    token &&
    (pathname === "/" || pathname === "/login" || pathname === "/signup")
  ) {
    return NextResponse.redirect(new URL("/app", request.url));
  }
  if (!token && pathname.startsWith("/app")) {
    return NextResponse.redirect(new URL("/", request.url)); // Redirect to the landing page
  }

  // Allow access to the current route
  return NextResponse.next();
}
