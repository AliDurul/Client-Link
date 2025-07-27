import { publicRoutes, authRoutes, apiAuthPrefix, DEFAULT_LOGIN_REDIRECT } from "./lib/utility/routes";
import { auth } from "./auth";

export default auth((req) => {
    const { nextUrl } = req;
    const isSessionExpired = req.auth?.error === "RefreshTokenError";
    const isLoggedIn = !!req.auth && !isSessionExpired;
    const userInfo = req.auth?.user;
    // console.log(isLoggedIn);

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) return null;

    if (isSessionExpired) {
        if (nextUrl.pathname !== "/login") {
            console.log('session expired, redirecting to login');
            const loginUrl = new URL("/login", nextUrl);
            loginUrl.searchParams.set("session_expired", "true");
            return Response.redirect(loginUrl);
        }
        return null;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return null;
    }


    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/login", nextUrl));
    }

    return null;
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};