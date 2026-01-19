import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DogForm from "../../../../components/DogForm";
import { cardStyles } from "@/lib/styles";

export default async function EditDogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const dog = await prisma.dog.findUnique({
    where: { id },
  });

  if (!dog) {
    notFound();
  }

  const statusBadgeClass =
    {
      Available:
        "bg-emerald-50 text-emerald-700 ring-emerald-100/80 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-900/40",
      Pending:
        "bg-amber-50 text-amber-700 ring-amber-100/80 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-900/40",
      Adopted:
        "bg-slate-100 text-slate-700 ring-slate-200/80 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700",
    }[dog.status] ??
    "bg-gray-100 text-gray-700 ring-gray-200/80 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700";

  // Transform database data to match DogFormData types
  const dogFormData = {
    id: dog.id,
    name: dog.name,
    breed: dog.breed,
    age: dog.age,
    sex: dog.sex as "Male" | "Female",
    size: dog.size as "Small" | "Medium" | "Large",
    status: dog.status,
    location: dog.location,
    description: dog.description,
    image: dog.image,
    gallery: dog.gallery ? JSON.parse(dog.gallery) : [],
  };

  return (
    <div className="space-y-6">
      <div className={`${cardStyles.gradient} space-y-2`}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-500 dark:text-orange-300">
          Edit
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Edit Dog: {dog.name}
            </h1>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
              Refresh photos, copy, and availability in one place.
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ring-1 ${statusBadgeClass}`}
          >
            Status: {dog.status}
          </span>
        </div>
      </div>

      <div className={`${cardStyles.base} p-6`}>
        <DogForm mode="edit" initialData={dogFormData} />
      </div>
    </div>
  );
}
