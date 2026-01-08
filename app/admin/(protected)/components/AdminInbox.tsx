"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Inquiry = {
  id: string;
  dogId: string;
  dogName: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  locale: string;
  createdAt: string;
};

const formatInquiryDate = (timestamp: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));

export default function AdminInbox() {
  const [open, setOpen] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }
  }, [open]);

  const loadInquiries = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/inquiries", {
        cache: "no-store",
        signal,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to load inquiries.");
      }

      const data: Inquiry[] = await response.json();
      setInquiries(data);
    } catch (err) {
      if ((err as { name?: string }).name === "AbortError") {
        return;
      }
      console.error("Failed to load inquiries", err);
      setError("Unable to load inquiries right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    void loadInquiries(controller.signal);
    return () => controller.abort();
  }, [loadInquiries, open]);

  useEffect(() => {
    if (open) {
      dialogRef.current?.focus();
    }
  }, [open]);

  const inquiriesList = useMemo(
    () =>
      inquiries.map((inquiry) => (
        <li
          key={inquiry.id}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
              {inquiry.dogName}
            </p>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatInquiryDate(inquiry.createdAt)}
            </span>
          </div>
          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
            {inquiry.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {inquiry.email} · {inquiry.phone}
          </p>
          {inquiry.message && (
            <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
              {inquiry.message}
            </p>
          )}
        </li>
      )),
    [inquiries]
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-full border border-transparent bg-orange-50 px-3 py-2 text-sm font-medium text-orange-700 transition hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-300 dark:hover:bg-orange-500/20"
        aria-label="View inquiries"
      >
        <span aria-hidden="true" className="text-lg">
          📬
        </span>
        <span className="ml-2 hidden text-xs uppercase tracking-wide sm:inline">
          Mailbox
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            className="relative z-10 mx-auto w-full max-w-3xl space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl outline-none dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Mailbox
                </p>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Inquiries
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-transparent bg-gray-100 px-3 py-1 text-sm text-gray-600 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                aria-label="Close mailbox"
              >
                Close
              </button>
            </div>

            <div className="flex gap-2 border-b border-gray-200 pb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:text-gray-400">
              <span className="border-b-2 border-orange-500 pb-1 text-orange-600 dark:text-orange-400">
                Inquiries
              </span>
            </div>

            <div className="max-h-[65vh] overflow-y-auto">
              {loading ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading inquiries…</p>
              ) : error ? (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              ) : inquiries.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No inquiries have been submitted yet.
                </p>
              ) : (
                <ul className="mt-2 space-y-3">{inquiriesList}</ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
