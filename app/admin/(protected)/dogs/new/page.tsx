import DogForm from "../../../components/DogForm";
import { cardStyles } from "@/lib/styles";

export default function NewDogPage() {
  return (
    <div className="space-y-6">
      <div className={`${cardStyles.gradient} space-y-2`}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-500 dark:text-orange-300">
          Create
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Add New Dog
            </h1>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
              Share a polished, adoption-ready profile for your next pup.
            </p>
          </div>
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700 ring-1 ring-orange-200/80 shadow-sm dark:bg-orange-950/30 dark:text-orange-200 dark:ring-orange-900/50">
            Crop + upload friendly
          </span>
        </div>
      </div>

      <div className={`${cardStyles.base} p-6`}>
        <DogForm mode="create" />
      </div>
    </div>
  );
}
