import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL = "www.mailexel.com";

export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0];

  // Skip redirect in local dev
  if (host === "localhost" || host === "127.0.0.1") {
    return NextResponse.next();
  }

  if (host !== CANONICAL) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = CANONICAL;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
