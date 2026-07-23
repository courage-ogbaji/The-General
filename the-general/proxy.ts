import { NextResponse } from "next/server";
import { auth } from "@/auth";

const CELEBRANT_ONLY_PREFIXES = ["/dashboard"];
const LOGIN_REQUIRED_PREFIXES = ["/gift", "/wishes/new", "/wishes/", "/profile"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const requiresCelebrant = CELEBRANT_ONLY_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const requiresLogin = LOGIN_REQUIRED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!requiresCelebrant && !requiresLogin) {
    return NextResponse.next();
  }

  if (!session?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (requiresCelebrant && session.user.role !== "CELEBRANT") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/gift",
    "/gift/:path*",
    "/wishes/new",
    "/wishes/:id/edit",
    "/profile",
    "/profile/:path*",
  ],
};
