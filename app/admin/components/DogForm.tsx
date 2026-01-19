"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ImageCropModal from "./ImageCropModal";
import { readFile, blobToFile } from "@/lib/image-utils";
import { buttonStyles, cardStyles, inputStyles } from "@/lib/styles";

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

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [cropType, setCropType] = useState<"primary" | "gallery">("primary");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

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
  const labelClass =
    "text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400";
  const fieldInputClass = `${inputStyles.base} mt-2`;

  async function handleImageUpload(file: File): Promise<string> {
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("dogName", formData.name.trim() || "temp");

    const response = await fetch("/api/upload", {
      method: "POST",
      body: uploadFormData,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Upload failed" }));
      throw new Error(errorData.error || "Failed to upload image");
    }

    const data = await response.json();
    return data.path;
  }

  async function handlePrimaryImageChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      alert("Please enter a dog name first");
      e.target.value = "";
      return;
    }

    try {
      // Read file and show crop modal
      const imageDataUrl = await readFile(file);
      setImageToCrop(imageDataUrl);
      setCropType("primary");
      setPendingFiles([file]);
      setCropModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("Failed to read image file");
    }

    // Clear input so same file can be selected again
    e.target.value = "";
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      alert("Please enter a dog name first");
      e.target.value = "";
      return;
    }

    // For gallery, crop one at a time (first file)
    try {
      const imageDataUrl = await readFile(files[0]);
      setImageToCrop(imageDataUrl);
      setCropType("gallery");
      setPendingFiles(files);
      setCropModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("Failed to read image file");
    }

    // Clear input so same files can be selected again
    e.target.value = "";
  }

  function removeGalleryImage(index: number) {
    const newGallery = formData.gallery.filter((_, i) => i !== index);
    setFormData({ ...formData, gallery: newGallery });
  }

  // Handle cropped image
  async function handleCroppedImage(croppedBlob: Blob) {
    setCropModalOpen(false);

    if (cropType === "primary") {
      setUploadingImage(true);
      try {
        // Convert blob to file with original name
        const originalFile = pendingFiles[0];
        const croppedFile = blobToFile(
          croppedBlob,
          originalFile.name || "cropped-image.jpg",
        );

        // Upload the cropped image
        const path = await handleImageUpload(croppedFile);
        setFormData({ ...formData, image: path });
      } catch (err) {
        console.error(err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to upload image";
        alert(errorMessage);
      } finally {
        setUploadingImage(false);
        setImageToCrop(null);
        setPendingFiles([]);
      }
    } else {
      // Gallery image
      setUploadingGallery(true);
      try {
        const originalFile = pendingFiles[0];
        const croppedFile = blobToFile(
          croppedBlob,
          originalFile.name || "cropped-gallery.jpg",
        );

        // Upload the cropped image
        const path = await handleImageUpload(croppedFile);
        setFormData({
          ...formData,
          gallery: [...formData.gallery, path],
        });

        // If more files in queue, show crop modal for next one
        const remainingFiles = pendingFiles.slice(1);
        if (remainingFiles.length > 0) {
          const nextImageDataUrl = await readFile(remainingFiles[0]);
          setImageToCrop(nextImageDataUrl);
          setPendingFiles(remainingFiles);
          setCropModalOpen(true);
        } else {
          setImageToCrop(null);
          setPendingFiles([]);
        }
      } catch (err) {
        console.error(err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to upload gallery image";
        alert(errorMessage);
        setImageToCrop(null);
        setPendingFiles([]);
      } finally {
        setUploadingGallery(false);
      }
    }
  }

  // Handle crop cancel
  function handleCropCancel() {
    setCropModalOpen(false);
    setImageToCrop(null);
    setPendingFiles([]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url =
        mode === "create" ? "/api/dogs" : `/api/dogs/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      // Set default values for breed, age, location, and description if empty
      const submissionData = {
        ...formData,
        breed: formData.breed.trim() || "To be determined",
        age: formData.age.trim() || "To be determined",
        location: formData.location.trim() || "Sunrise Sanctuary, PR",
        description:
          formData.description.trim() ||
          `Meet ${formData.name}! More details coming soon. This sweet pup is waiting for their forever home.`,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-800 shadow-sm dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className={`${cardStyles.gradient} space-y-4`}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 dark:text-orange-300">
                  Profile basics
                </p>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {mode === "create"
                    ? "New dog profile"
                    : `Update ${formData.name || "profile"}`}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Name, breed, and quick details the public sees first.
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700 ring-1 ring-orange-200/80 shadow-sm dark:bg-orange-950/30 dark:text-orange-200 dark:ring-orange-900/50">
                * Required
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={fieldInputClass}
                />
              </div>

              <div>
                <label htmlFor="breed" className={labelClass}>
                  Breed
                </label>
                <input
                  type="text"
                  id="breed"
                  placeholder="To be determined"
                  value={formData.breed}
                  onChange={(e) =>
                    setFormData({ ...formData, breed: e.target.value })
                  }
                  className={fieldInputClass}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="age" className={labelClass}>
                  Age
                </label>
                <input
                  type="text"
                  id="age"
                  placeholder="To be determined"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  className={fieldInputClass}
                />
              </div>
              <div>
                <label htmlFor="location" className={labelClass}>
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  placeholder="Sunrise Sanctuary, PR"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className={fieldInputClass}
                />
              </div>
            </div>
          </div>

          <div className={`${cardStyles.base} space-y-3 p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  Story
                </p>
                <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                  Description
                </h4>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">
                Optional
              </span>
            </div>
            <textarea
              id="description"
              rows={5}
              placeholder="Meet [Dog Name]! More details coming soon. This sweet pup is waiting for their forever home."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={`${fieldInputClass} min-h-[160px] resize-none`}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              We auto-fill gentle copy if left blank to avoid empty profiles.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className={`${cardStyles.base} space-y-4 p-6`}>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                Availability
              </p>
              <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                Adoption details
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Keep this aligned with shelter records.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="sex" className={labelClass}>
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
                  className={fieldInputClass}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label htmlFor="size" className={labelClass}>
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
                  className={fieldInputClass}
                >
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="status" className={labelClass}>
                  Status *
                </label>
                <select
                  id="status"
                  required
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as
                        | "Available"
                        | "Pending"
                        | "Adopted",
                    })
                  }
                  className={fieldInputClass}
                >
                  <option value="Available">Available</option>
                  <option value="Pending">Pending</option>
                  <option value="Adopted">Adopted</option>
                </select>
              </div>
            </div>
          </div>

          <div className={`${cardStyles.base} space-y-4 p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  Primary image *
                </p>
                <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                  Hero photo
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Landscape crops (4:3) feel best on listings.
                </p>
              </div>
              {formData.image && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 ring-1 ring-emerald-100/80 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-900/40">
                  Updated
                </span>
              )}
            </div>
            <div className="rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/60 px-4 py-5 text-center shadow-inner dark:border-orange-900/50 dark:bg-orange-950/30">
              <input
                type="file"
                id="primary-image"
                accept="image/*"
                onChange={handlePrimaryImageChange}
                disabled={uploadingImage}
                className="w-full cursor-pointer text-sm text-gray-900 shadow-none file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white transition hover:file:bg-orange-600 focus:outline-none disabled:cursor-not-allowed dark:text-gray-200 dark:file:bg-orange-600 dark:hover:file:bg-orange-500"
              />
              <p className="mt-2 text-xs text-orange-700/80 dark:text-orange-200/80">
                Cropping opens automatically after selection.
              </p>
              {uploadingImage && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Uploading...
                </p>
              )}
            </div>
            {formData.image && (
              <div className="rounded-2xl border border-orange-100/70 bg-white/70 p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900/60">
                <Image
                  src={formData.image}
                  alt="Primary"
                  width={320}
                  height={240}
                  className="h-full w-full rounded-2xl object-cover shadow-md"
                />
              </div>
            )}
          </div>

          <div className={`${cardStyles.base} space-y-4 p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  Gallery
                </p>
                <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                  Optional supporting shots
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Upload one at a time; we’ll prompt you to crop each image.
                </p>
              </div>
              {formData.gallery.length > 0 && (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 ring-1 ring-blue-100/80 dark:bg-blue-500/10 dark:text-blue-200 dark:ring-blue-900/40">
                  {formData.gallery.length} added
                </span>
              )}
            </div>
            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white/60 px-4 py-5 text-center shadow-inner dark:border-gray-800 dark:bg-gray-900/50">
              <input
                type="file"
                id="gallery"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                disabled={uploadingGallery}
                className="w-full cursor-pointer text-sm text-gray-900 shadow-none file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white transition hover:file:bg-black focus:outline-none disabled:cursor-not-allowed dark:bg-gray-950 dark:text-gray-200 dark:file:bg-gray-100 dark:file:text-gray-900 dark:hover:file:bg-gray-50"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Choose multiple files and crop them back-to-back.
              </p>
              {uploadingGallery && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Uploading...
                </p>
              )}
            </div>
            {formData.gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {formData.gallery.map((img, idx) => (
                  <div
                    key={idx}
                    className="group relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/70 shadow-sm dark:border-gray-800 dark:bg-gray-900/60"
                  >
                    <Image
                      src={img}
                      alt={`Gallery ${idx + 1}`}
                      width={200}
                      height={200}
                      className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.02]"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-xs font-semibold text-white opacity-90 shadow-sm transition hover:opacity-100"
                      aria-label={`Remove gallery image ${idx + 1}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange-100/80 bg-white/70 px-4 py-3 text-sm text-gray-600 shadow-inner dark:border-gray-800 dark:bg-gray-900/70 dark:text-gray-300">
        <p className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full bg-orange-500" />
          Cropping keeps uploads tidy; we also fill in gentle defaults when fields are blank.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.image}
            className={`${buttonStyles.primary} disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {loading
              ? "Saving..."
              : mode === "create"
                ? "Create Dog"
                : "Update Dog"}
          </button>
        </div>
      </div>

      {/* Image Crop Modal */}
      {cropModalOpen && imageToCrop && (
        <ImageCropModal
          imageSrc={imageToCrop}
          onComplete={handleCroppedImage}
          onCancel={handleCropCancel}
          aspectRatio={4 / 3}
          title={
            cropType === "primary" ? "Crop Primary Image" : "Crop Gallery Image"
          }
        />
      )}
    </form>
  );
}
