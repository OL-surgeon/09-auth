// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { serverGetSession } from "./lib/api/serverApi";
import { parse } from "cookie";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const { pathname } = request.nextUrl;
  const isPrivateRoute = privateRoutes.some((r) => pathname.startsWith(r));
  const isPublicRoute = publicRoutes.some((r) => pathname.startsWith(r));

  if (!accessToken && refreshToken) {
    try {
      const res = await serverGetSession();
      const setCookieHeader = res.headers["set-cookie"];

      if (setCookieHeader) {
        const cookieArray = Array.isArray(setCookieHeader)
          ? setCookieHeader
          : [setCookieHeader];

        const response = isPublicRoute
          ? NextResponse.redirect(new URL("/", request.url))
          : NextResponse.next();

        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);
          const options = {
            path: parsed.Path || "/",

            ...(parsed.Expires ? { expires: new Date(parsed.Expires) } : {}),
            ...(parsed["Max-Age"] ? { maxAge: Number(parsed["Max-Age"]) } : {}),
            httpOnly: true,
          } as const;

          if (parsed.accessToken) {
            accessToken = parsed.accessToken;
            response.cookies.set("accessToken", parsed.accessToken, options);
          }
          if (parsed.refreshToken) {
            response.cookies.set("refreshToken", parsed.refreshToken, options);
          }
        }

        return response;
      }
    } catch (e) {
      console.error("Session refresh failed:", e);
    }
  }

  if (!accessToken && isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
