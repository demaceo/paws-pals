"use client";

import { useEffect, useRef, useState } from "react";
import type { Dog } from "@/lib/dogs";

type Props = {
  dog: Dog;
  action: (formData: FormData) => Promise<void> | void;
};

export default function AdoptionModal({ dog, action }: Props) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
      >
        Start adoption
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
                  Adopt {dog.name}
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Tell us a bit about you and your home. We’ll get back within 24–48 hours.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-white/15 dark:bg-zinc-800 dark:text-zinc-200"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form action={action} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <input type="hidden" name="dogId" value={dog.id} />
              <input type="hidden" name="dogName" value={dog.name} />
              <div className="md:col-span-1">
                <label className="mb-1 block text-xs text-zinc-500" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-indigo-400 dark:border-white/15 dark:bg-zinc-950"
                />
              </div>
              <div className="md:col-span-1">
                <label className="mb-1 block text-xs text-zinc-500" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-indigo-400 dark:border-white/15 dark:bg-zinc-950"
                />
              </div>
              <div className="md:col-span-1">
                <label className="mb-1 block text-xs text-zinc-500" htmlFor="phone">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(555) 555-1234"
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-indigo-400 dark:border-white/15 dark:bg-zinc-950"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs text-zinc-500" htmlFor="message">
                  Tell us about your home/environment
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Yard or nearby park? Any other pets? Daily schedule?"
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-indigo-400 dark:border-white/15 dark:bg-zinc-950"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 md:w-auto"
                >
                  Submit inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
