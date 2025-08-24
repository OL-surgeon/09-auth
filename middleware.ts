import { NextRequest, NextResponse } from "next/server";
import { serverGetSession } from "./lib/api/serverApi";
import { parse } from "cookie";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = request.cookies;
  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const response = NextResponse.next();

  if (!accessToken && refreshToken) {
    try {
      const data = await serverGetSession();
      const setCookie = data.headers["set-cookie"];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);

          if (parsed.accessToken) {
            accessToken = parsed.accessToken;
            response.cookies.set("accessToken", parsed.accessToken, {
              path: parsed.Path || "/",
              httpOnly: true,
              secure: true,
              sameSite: "lax",
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
            });
          }

          if (parsed.refreshToken) {
            response.cookies.set("refreshToken", parsed.refreshToken, {
              path: parsed.Path || "/",
              httpOnly: true,
              secure: true,
              sameSite: "lax",
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
            });
          }
        }
      }
    } catch (err) {
      console.error("Session refresh failed:", err);
    }
  }

  if (!accessToken && isPrivateRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  if (accessToken && isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
