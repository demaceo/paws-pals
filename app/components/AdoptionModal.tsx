"use client";

import { useEffect, useMemo, useRef, useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import type { Dog } from "@/lib/dogs";
import { useI18n } from "@/app/i18n/LocaleProvider";

type ActionState = { ok: boolean; error?: string; dogName?: string };

type Props = {
  dog: Dog;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useI18n();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-60 md:w-auto"
    >
      {pending ? t("form.submitting") : t("form.submit")}
    </button>
  );
}

export default function AdoptionModal({ dog, action }: Props) {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // useActionState to capture server action result
  const initialState = useMemo<ActionState>(() => ({ ok: false }), []);
  const [state, formAction] = useActionState(action, initialState);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = dialogRef.current;
    const prev = document.activeElement as HTMLElement | null;
    el?.focus();
    return () => prev?.focus();
  }, [open]);

  // Redirect on success (client-side) after a tiny delay
  useEffect(() => {
    if (state.ok) {
      const name = state.dogName || dog.name;
      const t = setTimeout(() => router.push(`/thank-you?dog=${encodeURIComponent(name)}`), 500);
      return () => clearTimeout(t);
    }
  }, [state, router, dog.name]);

  // Phone masking (US): (XXX) XXX-XXXX
  const [phone, setPhone] = useState("");
  function formatPhone(input: string) {
    const digits = input.replace(/\D/g, "").slice(0, 10);
    const parts = [] as string[];
    if (digits.length > 0) parts.push("(" + digits.slice(0, 3));
    if (digits.length >= 4) parts[0] += ") ";
    if (digits.length >= 4) parts.push(digits.slice(3, 6));
    if (digits.length >= 7) parts[1] += "-";
    if (digits.length >= 7) parts.push(digits.slice(6, 10));
    return parts.join("");
  }
  function onPhoneChange(v: string) {
    setPhone(formatPhone(v));
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
      >
        {t("dog.adopt")}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4"
          aria-labelledby="adopt-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div
            ref={dialogRef}
            tabIndex={-1}
            className="relative z-61 w-full max-w-xl rounded-3xl border border-black/10 bg-white p-6 shadow-xl outline-none dark:border-white/15 dark:bg-zinc-900"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="adopt-title" className="text-xl font-semibold tracking-tight">
                  {t("modal.title", { name: dog.name })}
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t("modal.subtitle")}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-white/15 dark:bg-zinc-800 dark:text-zinc-200"
                aria-label={t("modal.close")}
              >
                ✕
              </button>
            </div>

            <form action={formAction} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <input type="hidden" name="dogId" value={dog.id} />
              <input type="hidden" name="dogName" value={dog.name} />
              <input type="hidden" name="locale" value={locale} />
              <div className="md:col-span-1">
                <label className="mb-1 block text-xs text-zinc-500" htmlFor="name">
                  {t("form.name")}
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  placeholder={t("form.name.placeholder")}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-indigo-400 dark:border-white/15 dark:bg-zinc-950"
                />
              </div>
              <div className="md:col-span-1">
                <label className="mb-1 block text-xs text-zinc-500" htmlFor="email">
                  {t("form.email")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder={t("form.email.placeholder")}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-indigo-400 dark:border-white/15 dark:bg-zinc-950"
                />
              </div>
              <div className="md:col-span-1">
                <label className="mb-1 block text-xs text-zinc-500" htmlFor="phone">
                  {t("form.phone")}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => onPhoneChange(e.target.value)}
                  placeholder={t("form.phone.placeholder")}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-indigo-400 dark:border-white/15 dark:bg-zinc-950"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs text-zinc-500" htmlFor="message">
                  {t("form.message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder={t("form.message.placeholder")}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-indigo-400 dark:border-white/15 dark:bg-zinc-950"
                />
              </div>
              <div className="md:col-span-2">
                <SubmitButton />
              </div>
            </form>

            {/* Inline banners for success/error */}
            {state.error && (
              <div className="mt-4 rounded-lg bg-red-600/10 px-3 py-2 text-sm text-red-700 dark:bg-red-600/15 dark:text-red-300">
                {state.error}
              </div>
            )}
            {state.ok && (
              <div className="mt-4 rounded-lg bg-emerald-600/10 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-600/15 dark:text-emerald-300">
                {t("form.success")}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
