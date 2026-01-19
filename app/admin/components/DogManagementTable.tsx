"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export type Dog = {
  id: string;
  name: string;
  breed: string;
  age: string;
  sex: "Male" | "Female";
  size: "Small" | "Medium" | "Large";
  status: "Available" | "Pending" | "Adopted";
  location: string;
  image: string;
};

const editableFields = [
  "name",
  "breed",
  "age",
  "sex",
  "size",
  "status",
] as const;

type EditableField = (typeof editableFields)[number];
type EditableDogFields = Pick<Dog, EditableField>;

function pickEditableFields(dog: Dog): EditableDogFields {
  return {
    name: dog.name,
    breed: dog.breed,
    age: dog.age,
    sex: dog.sex,
    size: dog.size,
    status: dog.status,
  };
}

function buildDrafts(dogs: Dog[]): Record<string, EditableDogFields> {
  return Object.fromEntries(
    dogs.map((dog) => [dog.id, pickEditableFields(dog)])
  );
}

export default function DogManagementTable({ dogs }: { dogs: Dog[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Dog[]>(dogs);
  const [drafts, setDrafts] = useState<Record<string, EditableDogFields>>(() =>
    buildDrafts(dogs)
  );
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | Dog["status"]
  >("all");

  useEffect(() => {
    setRows(dogs);
    setDrafts(buildDrafts(dogs));
  }, [dogs]);

  const rowsById = useMemo(
    () =>
      rows.reduce<Record<string, Dog>>((acc, row) => {
        acc[row.id] = row;
        return acc;
      }, {}),
    [rows]
  );

  const [sexFilter, setSexFilter] = useState<"all" | Dog["sex"]>("all");
  const [sizeFilter, setSizeFilter] = useState<"all" | Dog["size"]>("all");
  const controlClass =
    "w-full rounded-xl border border-orange-100/80 bg-white/80 px-3 py-2 text-sm text-gray-900 shadow-inner shadow-orange-100/40 transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-900/60 dark:text-white dark:shadow-black/30 dark:focus:border-orange-500 dark:focus:ring-orange-900/40";
  const labelClass =
    "block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400";

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return rows.filter((dog) => {
      if (statusFilter !== "all" && dog.status !== statusFilter) {
        return false;
      }
      if (sexFilter !== "all" && dog.sex !== sexFilter) {
        return false;
      }
      if (sizeFilter !== "all" && dog.size !== sizeFilter) {
        return false;
      }

      if (!query) return true;

      const haystack = `${dog.name} ${dog.breed} ${dog.location}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [rows, searchQuery, statusFilter, sexFilter, sizeFilter]);

  const totals = useMemo(() => {
    return {
      total: rows.length,
      available: rows.filter((dog) => dog.status === "Available").length,
      pending: rows.filter((dog) => dog.status === "Pending").length,
      adopted: rows.filter((dog) => dog.status === "Adopted").length,
    };
  }, [rows]);

  const visibleCount = filteredRows.length;

  function handleFieldChange<K extends EditableField>(
    id: string,
    field: K,
    value: EditableDogFields[K]
  ) {
    setDrafts((prev) => {
      const base = prev[id] || (rowsById[id] && pickEditableFields(rowsById[id]));
      if (!base) return prev;
      return {
        ...prev,
        [id]: {
          ...base,
          [field]: value,
        },
      };
    });
    setErrors((prev) => ({ ...prev, [id]: "" }));
  }

  function isDirty(id: string) {
    const original = rowsById[id];
    const draft = drafts[id];
    if (!original || !draft) return false;
    return editableFields.some((field) => draft[field] !== original[field]);
  }

  async function handleSave(id: string) {
    const draft = drafts[id];
    if (!draft || !isDirty(id)) return;

    setSaving(id);
    setErrors((prev) => ({ ...prev, [id]: "" }));

    try {
      const response = await fetch(`/api/dogs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      if (!response.ok) {
        let message = "Failed to update dog";
        try {
          const data = await response.json();
          message = data?.error || message;
        } catch {
          // ignore parse errors
        }
        throw new Error(message);
      }

      const data = (await response.json()) as Dog;
      const updated = {
        ...(rowsById[id] || ({} as Dog)),
        ...pickEditableFields(data),
      };

      setRows((prev) =>
        prev.map((row) => (row.id === id ? updated : row))
      );
      setDrafts((prev) => ({ ...prev, [id]: pickEditableFields(updated) }));

      const hasOtherDirty = Object.keys(drafts).some(
        (draftId) => draftId !== id && isDirty(draftId)
      );
      if (!hasOtherDirty) {
        router.refresh();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update dog";
      setErrors((prev) => ({ ...prev, [id]: message }));
    } finally {
      setSaving(null);
    }
  }

  async function handleDelete(id: string) {
    const dogName = drafts[id]?.name || rowsById[id]?.name || "this dog";
    if (!confirm(`Are you sure you want to delete ${dogName}?`)) {
      return;
    }

    setDeleting(id);

    try {
      const response = await fetch(`/api/dogs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setRows((prev) => prev.filter((row) => row.id !== id));
        setDrafts((prev) => {
          const rest = { ...prev };
          delete rest[id];
          return rest;
        });

        const hasOtherDirty = Object.keys(drafts).some(
          (draftId) => draftId !== id && isDirty(draftId)
        );
        if (!hasOtherDirty) {
          router.refresh();
        }
      } else {
        alert("Failed to delete dog");
      }
    } catch (error) {
      console.error("Error deleting dog:", error);
      alert("An error occurred while deleting");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-5">
      <section className="space-y-5 rounded-3xl bg-white/80 p-6 shadow-inner shadow-orange-100/40 backdrop-blur dark:bg-gray-950/70 dark:shadow-black/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 dark:text-orange-300">
              Control Center
            </p>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
              Dog roster & filters
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tune the roster, adjust statuses, and keep the dashboard clean.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 shadow-sm ring-1 ring-emerald-100/80 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-900/40">
              {totals.available} Available
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700 shadow-sm ring-1 ring-amber-100/80 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-900/40">
              {totals.pending} Pending
            </span>
            <span className="rounded-full bg-slate-50 px-3 py-1 text-slate-700 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-500/15 dark:text-slate-200 dark:ring-slate-800/50">
              {totals.adopted} Adopted
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 shadow-sm ring-1 ring-gray-200/80 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700">
              Showing {visibleCount}/{totals.total}
            </span>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-1">
          <div>
            <label htmlFor="dog-search" className={labelClass}>
              Search
            </label>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                  />
                </svg>
              </span>
              <input
                id="dog-search"
                type="search"
                placeholder="Search by name, breed, or location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${controlClass} pl-10`}
              />
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="status-filter" className={labelClass}>
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | Dog["status"])
              }
              className={`${controlClass} mt-2`}
            >
              <option value="all">All statuses</option>
              <option value="Available">Available</option>
              <option value="Pending">Pending</option>
              <option value="Adopted">Adopted</option>
            </select>
          </div>
          <div>
            <label htmlFor="sex-filter" className={labelClass}>
              Sex
            </label>
            <select
              id="sex-filter"
              value={sexFilter}
              onChange={(e) =>
                setSexFilter(e.target.value as "all" | Dog["sex"])
              }
              className={`${controlClass} mt-2`}
            >
              <option value="all">All sexes</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label htmlFor="size-filter" className={labelClass}>
              Size
            </label>
            <select
              id="size-filter"
              value={sizeFilter}
              onChange={(e) =>
                setSizeFilter(e.target.value as "all" | Dog["size"])
              }
              className={`${controlClass} mt-2`}
            >
              <option value="all">All sizes</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-orange-100/70 bg-white/80 shadow-sm shadow-orange-100/40 dark:border-gray-800 dark:bg-gray-900/60 dark:shadow-black/30">
          <table className="min-w-full divide-y divide-orange-100/80 dark:divide-gray-800">
            <thead className="bg-gradient-to-r from-orange-50/60 via-white to-orange-50/60 text-left dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
              <tr>
                <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600 dark:text-gray-400">
                  Image
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600 dark:text-gray-400">
                  Name
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600 dark:text-gray-400">
                  Breed
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600 dark:text-gray-400">
                  Age
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600 dark:text-gray-400">
                  Sex
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600 dark:text-gray-400">
                  Size
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100/80 bg-white/50 dark:divide-gray-800 dark:bg-gray-950/40">
              {filteredRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No dogs match your search or filters.
                  </td>
                </tr>
              ) : (
                filteredRows.map((dog) => {
                  const draft = drafts[dog.id] || pickEditableFields(dog);
                  const dirty = isDirty(dog.id);
                  const isSaving = saving === dog.id;
                  const isDeleting = deleting === dog.id;
                  const error = errors[dog.id];

                  return (
                    <tr
                      key={dog.id}
                      className="transition hover:-translate-y-[1px] hover:bg-orange-50/60 hover:shadow-sm hover:shadow-orange-100/60 dark:hover:bg-white/5"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <Image
                          src={dog.image}
                          alt={dog.name}
                          width={64}
                          height={64}
                          className="rounded-xl object-cover ring-2 ring-orange-100/80 shadow-sm dark:ring-gray-800"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={draft.name}
                          onChange={(e) =>
                            handleFieldChange(dog.id, "name", e.target.value)
                          }
                          disabled={isSaving || isDeleting}
                          className={`${controlClass} min-w-[8rem]`}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={draft.breed}
                          onChange={(e) =>
                            handleFieldChange(dog.id, "breed", e.target.value)
                          }
                          disabled={isSaving || isDeleting}
                          className={`${controlClass} min-w-[10rem]`}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={draft.age}
                          onChange={(e) =>
                            handleFieldChange(dog.id, "age", e.target.value)
                          }
                          disabled={isSaving || isDeleting}
                          className={`${controlClass} min-w-[6rem]`}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={draft.sex}
                          onChange={(e) =>
                            handleFieldChange(
                              dog.id,
                              "sex",
                              e.target.value as "Male" | "Female"
                            )
                          }
                          disabled={isSaving || isDeleting}
                          className={`${controlClass} min-w-[6rem]`}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={draft.size}
                          onChange={(e) =>
                            handleFieldChange(
                              dog.id,
                              "size",
                              e.target.value as "Small" | "Medium" | "Large"
                            )
                          }
                          disabled={isSaving || isDeleting}
                          className={`${controlClass} min-w-[7rem]`}
                        >
                          <option value="Small">Small</option>
                          <option value="Medium">Medium</option>
                          <option value="Large">Large</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={draft.status}
                          onChange={(e) =>
                            handleFieldChange(
                              dog.id,
                              "status",
                              e.target.value as "Available" | "Pending" | "Adopted"
                            )
                          }
                          disabled={isSaving || isDeleting}
                          className={`${controlClass} min-w-[8rem]`}
                        >
                          <option value="Available">Available</option>
                          <option value="Pending">Pending</option>
                          <option value="Adopted">Adopted</option>
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleSave(dog.id)}
                            disabled={!dirty || isSaving || isDeleting}
                            className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md hover:shadow-emerald-100/60 dark:border-emerald-900/40 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:shadow-emerald-900/40 disabled:translate-y-0 disabled:opacity-50"
                          >
                            {isSaving ? "Saving..." : dirty ? "Save" : "Saved"}
                          </button>
                          <Link
                            href={`/admin/dogs/${dog.id}/edit`}
                            className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md hover:shadow-blue-100/60 dark:border-blue-900/40 dark:bg-blue-500/10 dark:text-blue-200 dark:hover:shadow-blue-900/40"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(dog.id)}
                            disabled={isSaving || isDeleting}
                            className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md hover:shadow-red-100/60 dark:border-red-900/40 dark:bg-red-500/10 dark:text-red-200 dark:hover:shadow-red-900/40 disabled:translate-y-0 disabled:opacity-50"
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                        {error && (
                          <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                            {error}
                          </p>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
