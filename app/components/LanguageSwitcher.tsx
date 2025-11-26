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
    <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white p-1 text-xs dark:border-white/15 dark:bg-zinc-900">
      <button
        type="button"
        className={`rounded-full px-2 py-1 transition-colors ${
          locale === "en"
            ? "bg-indigo-600 text-white"
            : "text-zinc-700 dark:text-zinc-200"
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
        className={`rounded-full px-2 py-1 transition-colors ${
          locale === "es"
            ? "bg-indigo-600 text-white"
            : "text-zinc-700 dark:text-zinc-200"
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
