"use client";

import { useMemo, useState } from "react";
import DogCard from "./DogCard";
import type { Dog } from "@/lib/dogs";
import { useI18n } from "@/app/i18n/LocaleProvider";

function ageToMonths(age: string): number | null {
  const num = parseFloat(age);
  if (Number.isNaN(num)) return null;
  if (age.toLowerCase().includes("month")) return Math.round(num);
  if (age.toLowerCase().includes("year")) return Math.round(num * 12);
  return null;
}

function getAgeGroup(months: number | null): "puppy" | "adult" | "senior" | null {
  if (months == null) return null;
  if (months < 12) return "puppy";
  if (months <= 84) return "adult"; // up to 7 years
  return "senior";
}

type Props = { dogs: Dog[] };

export default function DogExplorer({ dogs }: Props) {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [breed, setBreed] = useState("All");
  const [ageGroup, setAgeGroup] = useState(t("filters.any"));

  const breeds = useMemo(() => {
    const set = new Set<string>();
    dogs.forEach((d) => set.add(d.breed));
    return ["All", ...Array.from(set).sort()];
  }, [dogs]);

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return dogs.filter((d) => {
      if (qLower && !(`${d.name} ${d.breed}`.toLowerCase().includes(qLower))) {
        return false;
      }
      if (breed !== "All" && d.breed !== breed) return false;
      if (ageGroup !== t("filters.any")) {
        const months = ageToMonths(d.age);
        const g = getAgeGroup(months);
        if (
          (ageGroup === t("filters.puppy") && g !== "puppy") ||
          (ageGroup === t("filters.adult") && g !== "adult") ||
          (ageGroup === t("filters.senior") && g !== "senior")
        )
          return false;
      }
      return true;
    });
  }, [dogs, q, breed, ageGroup, t]);

  return (
    <>
      {/* Filters */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">{t("filters.searchLabel")}</label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("filters.searchPlaceholder")}
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-indigo-400 dark:border-white/15 dark:bg-zinc-950"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">{t("filters.breed")}</label>
              <select
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-zinc-950"
              >
                {breeds.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">{t("filters.age")}</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-zinc-950"
              >
                {[t("filters.any"), t("filters.puppy"), t("filters.adult"), t("filters.senior")].map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section id="dogs" className="mx-auto mt-8 max-w-7xl px-6">
        {filtered.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{t("grid.empty")}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((dog) => (
              <DogCard key={dog.id} dog={dog} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
