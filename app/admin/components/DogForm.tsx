"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type DogFormData = {
  name: string;
  breed: string;
  age: string;
  sex: "Male" | "Female";
  size: "Small" | "Medium" | "Large";
  status: "Available" | "Pending" | "Adopted";
  location: string;
  description: string;
  image: string;
  gallery: string[];
};

type DogFormProps = {
  initialData?: DogFormData & { id: string };
  mode: "create" | "edit";
};

export default function DogForm({ initialData, mode }: DogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const [formData, setFormData] = useState<DogFormData>({
    name: initialData?.name || "",
    breed: initialData?.breed || "",
    age: initialData?.age || "",
    sex: initialData?.sex || "Male",
    size: initialData?.size || "Medium",
    status: initialData?.status || "Available",
    location: initialData?.location || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
    gallery: (() => {
      if (!initialData?.gallery) return [];
      if (Array.isArray(initialData.gallery)) return initialData.gallery;
      try {
        return JSON.parse(initialData.gallery as unknown as string);
      } catch {
        return [];
      }
    })(),
  });

  async function handleImageUpload(file: File): Promise<string> {
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("dogName", formData.name || "temp");

    const response = await fetch("/api/upload", {
      method: "POST",
      body: uploadFormData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.path;
  }

  async function handlePrimaryImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!formData.name) {
      alert("Please enter a dog name first");
      e.target.value = "";
      return;
    }

    setUploadingImage(true);
    try {
      const path = await handleImageUpload(file);
      setFormData({ ...formData, image: path });
    } catch (err) {
      console.error(err);
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (!formData.name) {
      alert("Please enter a dog name first");
      e.target.value = "";
      return;
    }

    setUploadingGallery(true);
    try {
      const paths = await Promise.all(
        files.map((file) => handleImageUpload(file))
      );
      setFormData({
        ...formData,
        gallery: [...formData.gallery, ...paths],
      });
    } catch (err) {
      console.error(err);
      alert("Failed to upload gallery images");
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  }

  function removeGalleryImage(index: number) {
    const newGallery = formData.gallery.filter((_, i) => i !== index);
    setFormData({ ...formData, gallery: newGallery });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url =
        mode === "create" ? "/api/dogs" : `/api/dogs/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save dog");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Name *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-800 focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label
            htmlFor="breed"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Breed *
          </label>
          <input
            type="text"
            id="breed"
            required
            value={formData.breed}
            onChange={(e) =>
              setFormData({ ...formData, breed: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-800 focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Age *
          </label>
          <input
            type="text"
            id="age"
            required
            placeholder="e.g., 2 years, 8 months"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-800 focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label
            htmlFor="sex"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Sex *
          </label>
          <select
            id="sex"
            required
            value={formData.sex}
            onChange={(e) =>
              setFormData({
                ...formData,
                sex: e.target.value as "Male" | "Female",
              })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-800 focus:border-orange-500 focus:ring-orange-500"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="size"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Size *
          </label>
          <select
            id="size"
            required
            value={formData.size}
            onChange={(e) =>
              setFormData({
                ...formData,
                size: e.target.value as "Small" | "Medium" | "Large",
              })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-800 focus:border-orange-500 focus:ring-orange-500"
          >
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Status *
          </label>
          <select
            id="status"
            required
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as "Available" | "Pending" | "Adopted",
              })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-800 focus:border-orange-500 focus:ring-orange-500"
          >
            <option value="Available">Available</option>
            <option value="Pending">Pending</option>
            <option value="Adopted">Adopted</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Location *
          </label>
          <input
            type="text"
            id="location"
            required
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-800 focus:border-orange-500 focus:ring-orange-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Description *
        </label>
        <textarea
          id="description"
          required
          rows={5}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-800 focus:border-orange-500 focus:ring-orange-500"
        />
      </div>

      <div>
        <label
          htmlFor="primary-image"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Primary Image *
        </label>
        <input
          type="file"
          id="primary-image"
          accept="image/*"
          onChange={handlePrimaryImageChange}
          disabled={uploadingImage}
          className="mt-1 block w-full text-sm text-gray-900 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-orange-900/20 dark:file:text-orange-400"
        />
        {uploadingImage && (
          <p className="mt-1 text-sm text-gray-500">Uploading...</p>
        )}
        {formData.image && (
          <div className="mt-2">
            <Image
              src={formData.image}
              alt="Primary"
              width={200}
              height={200}
              className="rounded-lg object-cover"
            />
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="gallery"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Gallery Images (Optional)
        </label>
        <input
          type="file"
          id="gallery"
          accept="image/*"
          multiple
          onChange={handleGalleryUpload}
          disabled={uploadingGallery}
          className="mt-1 block w-full text-sm text-gray-900 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-orange-900/20 dark:file:text-orange-400"
        />
        {uploadingGallery && (
          <p className="mt-1 text-sm text-gray-500">Uploading...</p>
        )}
        {formData.gallery.length > 0 && (
          <div className="mt-2 grid grid-cols-4 gap-2">
            {formData.gallery.map((img, idx) => (
              <div key={idx} className="relative">
                <Image
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(idx)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !formData.image}
          className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Saving..."
            : mode === "create"
            ? "Create Dog"
            : "Update Dog"}
        </button>
      </div>
    </form>
  );
}
