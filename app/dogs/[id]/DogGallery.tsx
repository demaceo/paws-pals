"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useI18n } from "@/app/i18n/LocaleProvider";

type Props = {
  images: string[];
  name: string;
};

export default function DogGallery({ images, name }: Props) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const total = images.length;

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight" && total > 1) next();
      if (event.key === "ArrowLeft" && total > 1) prev();
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [next, open, prev, total]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (total === 0) return null;
  const currentImage = images[index] ?? images[0];

  return (
    <div className="lg:col-span-3">
      <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white p-2 shadow-sm dark:border-orange-900/30 dark:bg-zinc-800">
        <button
          type="button"
          onClick={() => openAt(0)}
          aria-label={t("gallery.open")}
          className="group relative block w-full cursor-zoom-in"
        >
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
            <Image
              src={currentImage}
              alt={name}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 transition group-hover:opacity-100" />
            {total > 1 && (
              <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white shadow-lg shadow-black/30 backdrop-blur">
                <span>{t("gallery.viewAll", { count: total })}</span>
              </div>
            )}
          </div>
        </button>

        {total > 1 && (
          <div className="mt-2 grid grid-cols-4 gap-2">
            {images.slice(0, 4).map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => openAt(i)}
                aria-label={t("gallery.thumbnail", { index: i + 1 })}
                className={`relative aspect-4/3 w-full overflow-hidden rounded-xl bg-zinc-100 transition hover:ring-2 hover:ring-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 dark:bg-zinc-900 ${index === i ? "ring-2 ring-orange-400" : ""}`}
              >
                <Image
                  src={src}
                  alt={`${name} ${i + 1}`}
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t("gallery.open")}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-5xl space-y-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide">
                <span className="rounded-full bg-white/10 px-3 py-1">{name}</span>
                {total > 1 && (
                  <span className="rounded-full bg-white/10 px-3 py-1">
                    {t("gallery.count", { current: index + 1, total })}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
                aria-label={t("gallery.close")}
              >
                {t("gallery.close")}
              </button>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
              <Image
                key={currentImage}
                src={currentImage}
                alt={`${name} ${index + 1}`}
                fill
                sizes="100vw"
                priority
                className="object-contain"
              />
              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/15 p-3 text-white shadow-lg transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
                    aria-label={t("gallery.prev")}
                  >
                    {"<"}
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/15 p-3 text-white shadow-lg transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
                    aria-label={t("gallery.next")}
                  >
                    {">"}
                  </button>
                </>
              )}
            </div>

            {total > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={`relative h-16 w-24 overflow-hidden rounded-xl border ${i === index ? "border-orange-400 ring-2 ring-orange-300" : "border-white/10"} transition hover:border-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300`}
                    aria-label={t("gallery.thumbnail", { index: i + 1 })}
                  >
                    <Image
                      src={src}
                      alt={`${name} ${i + 1}`}
                      fill
                      sizes="20vw"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
