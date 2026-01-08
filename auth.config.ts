import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";

export const authConfig: NextAuthConfig = {
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const validatedFields = loginSchema.safeParse(credentials);

                if (!validatedFields.success) {
                    return null;
                }

                const { email, password } = validatedFields.data;

                const admin = await prisma.admin.findUnique({
                    where: { email },
                });

                if (!admin) {
                    return null;
                }

                const passwordMatch = await bcrypt.compare(password, admin.password);

                if (!passwordMatch) {
                    return null;
                }

                return {
                    id: admin.id,
                    email: admin.email,
                    name: admin.name,
                };
            },
        }),
    ],
    pages: {
        signIn: "/admin/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;

            // Since login page is excluded from proxy matcher,
            // this callback only runs for protected admin routes
            return isLoggedIn;
        },
    },
};
