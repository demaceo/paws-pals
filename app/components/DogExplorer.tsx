"use client";

import { useMemo, useState } from "react";
import DogCard from "./DogCard";
import type { Dog } from "@/lib/dogs";

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
  const [q, setQ] = useState("");
  const [breed, setBreed] = useState("All");
  const [ageGroup, setAgeGroup] = useState("Any");

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
      if (ageGroup !== "Any") {
        const months = ageToMonths(d.age);
        const g = getAgeGroup(months);
        if (
          (ageGroup === "Puppy" && g !== "puppy") ||
          (ageGroup === "Adult" && g !== "adult") ||
          (ageGroup === "Senior" && g !== "senior")
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
        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Search by name or breed</label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="e.g., Luna or Beagle"
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-indigo-400 dark:border-white/15 dark:bg-zinc-950"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Breed</label>
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
              <label className="mb-1 block text-xs text-zinc-500">Age</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-zinc-950"
              >
                {(["Any", "Puppy", "Adult", "Senior"] as const).map((a) => (
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
          <p className="text-sm text-zinc-600 dark:text-zinc-400">No dogs match your filters.</p>
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
