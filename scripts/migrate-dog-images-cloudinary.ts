import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

const dryRun = process.argv.includes("--dry-run");
const skipPing = process.argv.includes("--skip-ping");
const limitIndex = process.argv.indexOf("--limit");
const limit =
  limitIndex !== -1 ? Number(process.argv[limitIndex + 1]) : undefined;

const cloudinaryUrl = process.env.CLOUDINARY_URL;
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudinaryUrl && (!cloudName || !apiKey || !apiSecret)) {
  throw new Error(
    "Missing Cloudinary credentials. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
  );
}

if (cloudinaryUrl) {
  cloudinary.config(true);
} else {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

const publicRoot = path.join(process.cwd(), "public");
const uploadCache = new Map<string, string>();
const inflightUploads = new Map<string, Promise<string>>();

type DogRecord = {
  id: string;
  name: string;
  image: string;
  gallery: string | null;
};

function isLocalImage(value: string) {
  return value.startsWith("/dogs/");
}

function stripQueryAndHash(value: string) {
  return value.split("?")[0].split("#")[0];
}

function toLocalPath(value: string) {
  const clean = stripQueryAndHash(value);
  if (!clean.startsWith("/dogs/")) return null;
  return path.join(publicRoot, clean.replace(/^\/+/, ""));
}

function safeFolderSegment(value: string) {
  return value.trim().replace(/[\\/]+/g, "-").replace(/\s+/g, "-");
}

function resolveFolderName(imagePath: string, fallback: string) {
  const clean = stripQueryAndHash(imagePath);
  const parts = clean.split("/").filter(Boolean);
  const fromPath = parts[0] === "dogs" && parts[1] ? parts[1] : "";
  return safeFolderSegment(fromPath || fallback || "dogs");
}

async function parseGallery(value: string | null) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function uploadToCloudinary(filePath: string, folderName: string) {
  const folder = `paws-pals/dogs/${folderName}`;
  if (dryRun) {
    console.log(`[dry-run] Upload ${filePath} -> ${folder}`);
    return null;
  }

  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "image",
    transformation: [
      { width: 1200, height: 1200, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  });

  return result.secure_url;
}

async function migrateImage(imagePath: string, dogName: string) {
  if (!isLocalImage(imagePath)) return imagePath;

  const localPath = toLocalPath(imagePath);
  if (!localPath) return imagePath;

  const cached = uploadCache.get(localPath);
  if (cached) {
    return cached;
  }

  const inflight = inflightUploads.get(localPath);
  if (inflight) {
    return inflight;
  }

  try {
    await fs.access(localPath);
  } catch {
    console.warn(`Missing local file: ${localPath}`);
    return imagePath;
  }

  const folderName = resolveFolderName(imagePath, dogName);
  const uploadPromise = uploadToCloudinary(localPath, folderName)
    .then((uploadedUrl) => {
      const resolved = uploadedUrl || imagePath;
      uploadCache.set(localPath, resolved);
      inflightUploads.delete(localPath);
      return resolved;
    })
    .catch((error) => {
      inflightUploads.delete(localPath);
      throw error;
    });

  inflightUploads.set(localPath, uploadPromise);
  return uploadPromise;
}

async function verifyCloudinary() {
  if (skipPing) return;
  try {
    await cloudinary.api.ping();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Cloudinary error";
    throw new Error(
      `Cloudinary credentials failed verification: ${message}. Check CLOUDINARY_URL or the CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET values.`
    );
  }
}

async function run() {
  await verifyCloudinary();

  const dogs = await prisma.dog.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      gallery: true,
    },
    orderBy: { name: "asc" },
  });

  const targets = Number.isFinite(limit) ? dogs.slice(0, limit) : dogs;
  let updatedCount = 0;

  for (const dog of targets) {
    const updates: Partial<DogRecord> = {};

    const newImage = await migrateImage(dog.image, dog.name);
    if (newImage !== dog.image) {
      updates.image = newImage;
    }

    const gallery = await parseGallery(dog.gallery);
    let galleryChanged = false;
    const newGallery: string[] = [];

    for (const entry of gallery) {
      const migrated = await migrateImage(entry, dog.name);
      if (migrated !== entry) galleryChanged = true;
      newGallery.push(migrated);
    }

    if (galleryChanged) {
      updates.gallery = JSON.stringify(newGallery);
    }

    if (Object.keys(updates).length === 0) {
      continue;
    }

    if (dryRun) {
      console.log(`[dry-run] Update ${dog.name} (${dog.id})`, updates);
      continue;
    }

    await prisma.dog.update({
      where: { id: dog.id },
      data: updates,
    });
    updatedCount += 1;
    console.log(`Updated ${dog.name}`);
  }

  if (!dryRun) {
    console.log(`Migration complete. Updated ${updatedCount} dogs.`);
  }
}

run()
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
