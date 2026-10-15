import { NextRequest, NextResponse } from "next/server";
const redirects: Record<string, string> = {
  "/": "",
  "/trees": "/trees",
  "/species": "/trees",
  "/adopt": "/how-it-works",
  "/login": "/login",
  "/faq": "/faq",
  "/contact": "/contact",
  "/dashboard": "/dashboard",
  "/dashboard/dashboard": "/dashboard",
  "/dashboard/treeUpdate": "/dashboard",
  "/pp": "/dashboard",
  "/search": "/trees",
  "/search-db": "/trees",
  "/search-demo": "/trees",
  "/terms": "/terms",
  "/privacy": "/privacy",
};
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";
  if (pathname in redirects) {
    const url = request.nextUrl.clone();
    url.pathname = `/id${redirects[pathname]}`;
    return NextResponse.redirect(url, 307);
  }
  const headers = new Headers(request.headers);
  headers.set("x-pohonku-locale", pathname.startsWith("/en") ? "en" : "id");
  return NextResponse.next({ request: { headers } });
}
export const config = {
  matcher: ["/((?!api|_next|images|gambarCici|favicon.ico).*)"],
};
