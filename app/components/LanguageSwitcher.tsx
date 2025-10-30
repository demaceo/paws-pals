"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/app/i18n/LocaleProvider";
import { setLocaleAction } from "@/lib/i18n";

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
        className={`rounded-full px-2 py-1 ${locale === "en" ? "bg-indigo-600 text-white" : "text-zinc-700 dark:text-zinc-200"}`}
        onClick={() => switchTo("en")}
        aria-pressed={locale === "en"}
        disabled={pending}
      >EN</button>
      <button
        type="button"
        className={`rounded-full px-2 py-1 ${locale === "es" ? "bg-indigo-600 text-white" : "text-zinc-700 dark:text-zinc-200"}`}
        onClick={() => switchTo("es")}
        aria-pressed={locale === "es"}
        disabled={pending}
      >ES</button>
    </div>
  );
}
