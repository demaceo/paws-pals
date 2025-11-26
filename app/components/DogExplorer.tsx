"use client";

import { useMemo, useState, useEffect } from "react";
import DogCard from "./DogCard";
import type { Dog } from "@/lib/dogs";
import { useI18n } from "@/app/i18n/LocaleProvider";
import { saveFilterState, loadFilterState } from "./FilterPersistence";

function ageToMonths(age: string): number | null {
  const num = parseFloat(age);
  if (Number.isNaN(num)) return null;
  if (age.toLowerCase().includes("month")) return Math.round(num);
  if (age.toLowerCase().includes("year")) return Math.round(num * 12);
  return null;
}

function getAgeGroup(
  months: number | null
): "puppy" | "adult" | "senior" | null {
  if (months == null) return null;
  if (months < 12) return "puppy";
  if (months <= 84) return "adult"; // up to 7 years
  return "senior";
}

type Props = { dogs: Dog[] };

export default function DogExplorer({ dogs }: Props) {
  const { t } = useI18n();

  // Initialize state with saved values or defaults using lazy initializers
  const [q, setQ] = useState(() => {
    if (typeof window === "undefined") return "";
    const saved = loadFilterState();
    return saved?.query ?? "";
  });

  const [breed, setBreed] = useState(() => {
    if (typeof window === "undefined") return "all";
    const saved = loadFilterState();
    return saved?.breed ?? "all";
  });

  const [ageGroup, setAgeGroup] = useState(() => {
    if (typeof window === "undefined") return "any";
    const saved = loadFilterState();
    return saved?.ageGroup ?? "any";
  });

  // Save filter state whenever it changes
  useEffect(() => {
    saveFilterState({ query: q, breed, ageGroup });
  }, [q, breed, ageGroup]);

  const breeds = useMemo(() => {
    const set = new Set<string>();
    dogs.forEach((d) => set.add(d.breed));
    return ["all", ...Array.from(set).sort()];
  }, [dogs]);

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return dogs.filter((d) => {
      if (qLower && !`${d.name} ${d.breed}`.toLowerCase().includes(qLower)) {
        return false;
      }
      if (breed !== "all" && d.breed !== breed) return false;
      if (ageGroup !== "any") {
        const months = ageToMonths(d.age);
        const g = getAgeGroup(months);
        if (
          (ageGroup === "puppy" && g !== "puppy") ||
          (ageGroup === "adult" && g !== "adult") ||
          (ageGroup === "senior" && g !== "senior")
        )
          return false;
      }
      return true;
    });
  }, [dogs, q, breed, ageGroup]);

  return (
    <>
      {/* Filters */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="rounded-2xl border border-orange-100 bg-linear-to-br from-white to-orange-50/20 p-5 shadow-lg shadow-orange-100/20 dark:border-orange-900/30 dark:from-zinc-900 dark:to-orange-950/10 dark:shadow-orange-950/20">
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">
                {t("filters.searchLabel")}
              </label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("filters.searchPlaceholder")}
                className="w-full rounded-xl border-2 border-orange-200 bg-white px-3 py-2.5 text-sm outline-none ring-0 placeholder:text-zinc-400 transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-orange-900/50 dark:bg-zinc-950 dark:focus:border-orange-500 dark:focus:ring-orange-900/30"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">
                {t("filters.breed")}
              </label>
              <select
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full rounded-xl border-2 border-orange-200 bg-white px-3 py-2.5 text-sm transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-orange-900/50 dark:bg-zinc-950 dark:focus:border-orange-500 dark:focus:ring-orange-900/30"
              >
                {breeds.map((b) => (
                  <option key={b} value={b}>
                    {b === "all" ? t("filters.all") : b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">
                {t("filters.age")}
              </label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full rounded-xl border-2 border-orange-200 bg-white px-3 py-2.5 text-sm transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-orange-900/50 dark:bg-zinc-950 dark:focus:border-orange-500 dark:focus:ring-orange-900/30"
              >
                <option value="any">{t("filters.any")}</option>
                <option value="puppy">{t("filters.puppy")}</option>
                <option value="adult">{t("filters.adult")}</option>
                <option value="senior">{t("filters.senior")}</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section id="dogs" className="mx-auto mt-8 max-w-7xl px-6">
        {filtered.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {t("grid.empty")}
          </p>
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
