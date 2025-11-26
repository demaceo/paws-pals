import { cookies, headers } from "next/headers";
import { type Locale, locales, defaultLocale } from "./i18n-messages";

export async function getLocale(): Promise<Locale> {
    const c = await cookies();
    const cookieLocale = c.get("locale")?.value as Locale | undefined;
    if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;
    const h = await headers();
    const accept = h.get("accept-language") || "";
    const first = accept.split(",")[0]?.trim().toLowerCase();
    if (first?.startsWith("es")) return "es";
    return defaultLocale;
}

export async function setLocaleCookie(locale: Locale) {
    const c = await cookies();
    c.set("locale", locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
}
