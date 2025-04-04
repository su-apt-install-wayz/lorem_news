import { auth } from "@/auth"

export default auth((req) => {
    const isAuthRoute =
        req.nextUrl.pathname.startsWith("/") ||
        req.nextUrl.pathname.startsWith("/login") ||
        req.nextUrl.pathname.startsWith("/register") ||
        req.nextUrl.pathname.startsWith("/forgot-password") ||
        req.nextUrl.pathname.startsWith("/reset-password");

    if (!req.auth && !isAuthRoute) {
        const newUrl = new URL("/", req.nextUrl.origin)
        return Response.redirect(newUrl)
    }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"]
}