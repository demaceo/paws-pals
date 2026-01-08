import { auth } from "@/auth";

export default auth;

export const config = {
    matcher: [
        // Match all admin routes except login
        "/admin/((?!login).*)",
        "/admin",
    ],
};
