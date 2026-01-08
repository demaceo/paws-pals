import { auth } from "@/auth";
import type { NextRequest } from "next/server";

export default auth;

export const config = {
    matcher: [
        // Match all admin routes except login
        "/admin/((?!login).*)",
        "/admin",
    ],
};
