"use client";

import Image from "next/image";
import Link from "next/link";
import type { Dog } from "@/lib/dogs";
import { useI18n } from "@/app/i18n/LocaleProvider";
import { translateAttribute, translateAge } from "@/lib/i18n-helpers";

type Props = {
  dog: Dog;
};

export default function DogCard({ dog }: Props) {
  const { t, messages } = useI18n();

  return (
    <Link
      href={`/dogs/${dog.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-zinc-900"
      aria-label={t("card.viewDetails", { name: dog.name })}
    >
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <Image
          src={dog.image}
          alt={dog.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-300 group-hover:scale-105"
          priority={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-black/0 to-black/0" />
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-zinc-900 shadow-sm backdrop-blur">
            {translateAttribute(dog.sex, messages)}
          </span>
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-zinc-900 shadow-sm backdrop-blur">
            {translateAttribute(dog.size, messages)}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 p-4">
        <div>
          <h3 className="text-base font-semibold leading-tight text-zinc-950 dark:text-zinc-50">
            {dog.name}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {dog.breed}
          </p>
        </div>
        <span className="text-xs text-zinc-500">
          {translateAge(dog.age, messages)}
        </span>
      </div>
    </Link>
  );
}
