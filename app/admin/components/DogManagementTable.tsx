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
          const { [id]: _, ...rest } = prev;
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
      <section className="space-y-5 rounded-3xl border border-gray-200/70 bg-white/90 p-6 shadow-sm shadow-gray-900/5 backdrop-blur dark:border-gray-700/60 dark:bg-gray-900 dark:shadow-black/30">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Dog Management
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track availability, update records, and act on the latest dog
            information.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Showing {visibleCount}
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-gray-100">
              {totals.total} total dogs
            </span>
          </div>
          <div className="flex gap-3 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              {totals.available} Available
            </span>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
              {totals.pending} Pending
            </span>
            <span className="rounded-full bg-slate-50 px-2 py-0.5 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300">
              {totals.adopted} Adopted
            </span>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-1">
          <div>
            <label
              htmlFor="dog-search"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Search
            </label>
            <input
              id="dog-search"
              type="search"
              placeholder="Search by name, breed, or location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-white dark:bg-gray-800 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="status-filter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | Dog["status"])
              }
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-white dark:bg-gray-800 focus:border-orange-500 focus:ring-orange-500"
            >
              <option value="all">All statuses</option>
              <option value="Available">Available</option>
              <option value="Pending">Pending</option>
              <option value="Adopted">Adopted</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="sex-filter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Sex
            </label>
            <select
              id="sex-filter"
              value={sexFilter}
              onChange={(e) =>
                setSexFilter(e.target.value as "all" | Dog["sex"])
              }
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-white dark:bg-gray-800 focus:border-orange-500 focus:ring-orange-500"
            >
              <option value="all">All sexes</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="size-filter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Size
            </label>
            <select
              id="size-filter"
              value={sizeFilter}
              onChange={(e) =>
                setSizeFilter(e.target.value as "all" | Dog["size"])
              }
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-white dark:bg-gray-800 focus:border-orange-500 focus:ring-orange-500"
            >
              <option value="all">All sizes</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Breed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Sex
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
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
                      className="transition hover:bg-gray-50 hover:dark:bg-white/5"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Image
                          src={dog.image}
                          alt={dog.name}
                          width={64}
                          height={64}
                          className="rounded-lg object-cover"
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
                          className="w-full min-w-[8rem] rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm text-gray-900 dark:text-white dark:bg-gray-800 focus:border-orange-500 focus:ring-orange-500"
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
                          className="w-full min-w-[10rem] rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm text-gray-900 dark:text-white dark:bg-gray-800 focus:border-orange-500 focus:ring-orange-500"
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
                          className="w-full min-w-[6rem] rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm text-gray-900 dark:text-white dark:bg-gray-800 focus:border-orange-500 focus:ring-orange-500"
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
                          className="w-full min-w-[6rem] rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm text-gray-900 dark:text-white dark:bg-gray-800 focus:border-orange-500 focus:ring-orange-500"
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
                          className="w-full min-w-[7rem] rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm text-gray-900 dark:text-white dark:bg-gray-800 focus:border-orange-500 focus:ring-orange-500"
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
                          className="w-full min-w-[8rem] rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm text-gray-900 dark:text-white dark:bg-gray-800 focus:border-orange-500 focus:ring-orange-500"
                        >
                          <option value="Available">Available</option>
                          <option value="Pending">Pending</option>
                          <option value="Adopted">Adopted</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleSave(dog.id)}
                            disabled={!dirty || isSaving || isDeleting}
                            className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 disabled:opacity-50"
                          >
                            {isSaving ? "Saving..." : "Save"}
                          </button>
                          <Link
                            href={`/admin/dogs/${dog.id}/edit`}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(dog.id)}
                            disabled={isSaving || isDeleting}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                        {error && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
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
