"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/app/i18n/LocaleProvider";
import { setLocaleAction } from "@/lib/i18n-actions";

export default function LanguageSwitcher() {
  const { locale } = useI18n();
  const router = useRouter();
  const [pending, start] = useTransition();

  function switchTo(next: "en" | "es") {
    if (next === locale) return;
    start(async () => {
      const fd = new FormData();
      fd.set("locale", next);
      await setLocaleAction(fd);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1 rounded-full border-2 border-orange-200 bg-white p-1 text-xs shadow-sm dark:border-orange-900/50 dark:bg-zinc-900">
      <button
        type="button"
        className={`rounded-full px-2.5 py-1.5 font-semibold transition-all ${
          locale === "en"
            ? "bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/30"
            : "text-zinc-700 hover:bg-orange-50 dark:text-zinc-300 dark:hover:bg-orange-950/30"
        } ${pending ? "opacity-50" : ""}`}
        onClick={() => switchTo("en")}
        aria-pressed={locale === "en"}
        aria-label="Switch to English"
        disabled={pending}
      >
        {pending && locale !== "en" ? "..." : "EN"}
      </button>
      <button
        type="button"
        className={`rounded-full px-2.5 py-1.5 font-semibold transition-all ${
          locale === "es"
            ? "bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/30"
            : "text-zinc-700 hover:bg-orange-50 dark:text-zinc-300 dark:hover:bg-orange-950/30"
        } ${pending ? "opacity-50" : ""}`}
        onClick={() => switchTo("es")}
        aria-pressed={locale === "es"}
        aria-label="Switch to Spanish"
        disabled={pending}
      >
        {pending && locale !== "es" ? "..." : "ES"}
      </button>
    </div>
  );
}
