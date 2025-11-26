"use server";

import { type Locale, locales } from "./i18n-messages";
import { setLocaleCookie } from "./i18n-server";

export async function setLocaleAction(formData: FormData) {
    const loc = String(formData.get("locale") || "");
    if (locales.includes(loc as Locale)) {
        await setLocaleCookie(loc as Locale);
    }
}
