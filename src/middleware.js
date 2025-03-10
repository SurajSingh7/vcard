import { NextResponse } from "next/server";

export function middleware(req) {
    const url = req.nextUrl;
    const path = url.pathname;
    const token = req.cookies.get("token")?.value;

    const isPublicPath = path === "/";

    // Restricted paths that require authentication
    const restrictedPaths = ["/visitor-card", "/vcards-report", "/staff-details",];

    // Redirect unauthenticated users to the login page if they access restricted pages
    if (!token && restrictedPaths.includes(path)) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    // Redirect authenticated users away from login/signup/home page to "/shiftInitializer"
    if (token && isPublicPath) {
        return NextResponse.redirect(new URL("/visitor-card", req.nextUrl));
    }

    // Allow access to public paths or continue with authenticated requests
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/", 
        "/login", 
        "/visitor-card",
        "/vcards-report", 
        "/staff-details"
    ],
};

