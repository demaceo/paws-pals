import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DogManagementTable, { type Dog as ManagementDog } from "../components/DogManagementTable";
import { buttonStyles, cardStyles } from "@/lib/styles";

export default async function AdminDashboardPage() {
  const dbDogs = await prisma.dog.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      breed: true,
      age: true,
      sex: true,
      size: true,
      status: true,
      location: true,
      image: true,
      description: true,
    },
  });

  const dogs: ManagementDog[] = dbDogs.map((dog) => ({
    id: dog.id,
    name: dog.name,
    breed: dog.breed,
    age: dog.age,
    sex: dog.sex as ManagementDog["sex"],
    size: dog.size as ManagementDog["size"],
    status: dog.status as ManagementDog["status"],
    location: dog.location,
    image: dog.image,
    description: dog.description,
  }));

  const availableCount = dogs.filter((dog) => dog.status === "Available").length;
  const pendingCount = dogs.filter((dog) => dog.status === "Pending").length;
  const adoptedCount = dogs.filter((dog) => dog.status === "Adopted").length;
  const maleCount = dogs.filter((d) => d.sex === "Male").length;
  const femaleCount = dogs.filter((d) => d.sex === "Female").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.35fr,0.65fr]">
        <div className={`${cardStyles.gradient} h-full`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-500 dark:text-orange-300">
                Overview
              </p>
              <h1 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                Dog Management
              </h1>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                Keep profiles current, track availability, and share adoptable pups faster.
              </p>
            </div>
            <Link
              href="/admin/dogs/new"
              className={`${buttonStyles.primary} whitespace-nowrap`}
            >
              + Add New Dog
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-orange-100/80 bg-white/80 px-4 py-3 shadow-sm shadow-orange-100/40 dark:border-gray-800 dark:bg-gray-900/70 dark:shadow-black/30">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                Total
              </p>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {dogs.length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Across all statuses
              </p>
            </div>
            <div className="rounded-2xl border border-orange-100/80 bg-orange-50/70 px-4 py-3 shadow-sm shadow-orange-100/60 dark:border-orange-900/50 dark:bg-orange-950/30 dark:shadow-orange-950/30">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700 dark:text-orange-200">
                Ready now
              </p>
              <p className="mt-1 text-2xl font-semibold text-orange-800 dark:text-orange-100">
                {availableCount}
              </p>
              <p className="text-xs text-orange-700/80 dark:text-orange-200/80">
                Available for adoption
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200/80 bg-white/80 px-4 py-3 shadow-sm shadow-orange-100/40 dark:border-gray-800 dark:bg-gray-900/70 dark:shadow-black/30">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                Pending + Adopted
              </p>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {pendingCount} pending / {adoptedCount} adopted
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Keep an eye on these next
              </p>
            </div>
          </div>
        </div>

        <div className={`${cardStyles.base} h-full p-6`}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">
            Snapshot
          </p>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-orange-100/70 bg-orange-50/60 px-4 py-3 text-sm font-medium text-orange-800 shadow-sm dark:border-orange-900/50 dark:bg-orange-950/25 dark:text-orange-100">
              <span>Male</span>
              <span className="text-lg font-semibold">{maleCount}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-orange-100/70 bg-orange-50/60 px-4 py-3 text-sm font-medium text-orange-800 shadow-sm dark:border-orange-900/50 dark:bg-orange-950/25 dark:text-orange-100">
              <span>Female</span>
              <span className="text-lg font-semibold">{femaleCount}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
              <div className="rounded-lg border border-emerald-100 bg-emerald-50/70 px-2 py-3 text-emerald-700 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-200">
                <p>Available</p>
                <p className="mt-1 text-lg font-bold">{availableCount}</p>
              </div>
              <div className="rounded-lg border border-amber-100 bg-amber-50/70 px-2 py-3 text-amber-700 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200">
                <p>Pending</p>
                <p className="mt-1 text-lg font-bold">{pendingCount}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50/70 px-2 py-3 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100">
                <p>Adopted</p>
                <p className="mt-1 text-lg font-bold">{adoptedCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${cardStyles.base} overflow-hidden`}>
        {dogs.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No dogs found. Add your first dog to get started.
            </p>
          </div>
        ) : (
          <DogManagementTable dogs={dogs} />
        )}
      </div>
    </div>
  );
}
