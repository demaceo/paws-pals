import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { dogUpdateSchema } from "@/lib/validations";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET /api/dogs/[id] - Get a single dog
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const dog = await prisma.dog.findUnique({
            where: { id },
        });

        if (!dog || dog.status === "Adopted") {
            return NextResponse.json({ error: "Dog not found" }, { status: 404 });
        }

        // Parse gallery JSON string to array
        const response = {
            ...dog,
            gallery: dog.gallery ? JSON.parse(dog.gallery) : undefined,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching dog:", error);
        return NextResponse.json(
            { error: "Failed to fetch dog" },
            { status: 500 }
        );
    }
}

// PATCH /api/dogs/[id] - Update a dog (admin only)
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const validatedData = dogUpdateSchema.parse(body);

        // Get the current dog data to compare images
        const existingDog = await prisma.dog.findUnique({
            where: { id },
        });

        if (!existingDog) {
            return NextResponse.json({ error: "Dog not found" }, { status: 404 });
        }

        // Serialize gallery array to JSON string for database
        const dataToStore = {
            ...validatedData,
            gallery: validatedData.gallery ? JSON.stringify(validatedData.gallery) : undefined,
        };

        // Update the dog in database
        const dog = await prisma.dog.update({
            where: { id },
            data: dataToStore,
        });

        // Clean up replaced images from Cloudinary
        try {
            const imagesToDelete: string[] = [];

            // Check if primary image was replaced
            if (validatedData.image && existingDog.image !== validatedData.image) {
                if (existingDog.image.includes("cloudinary.com")) {
                    imagesToDelete.push(existingDog.image);
                }
            }

            // Check if gallery images were replaced or removed
            if (validatedData.gallery !== undefined) {
                const oldGallery = existingDog.gallery ? JSON.parse(existingDog.gallery) : [];
                const newGallery = validatedData.gallery || [];

                // Find images that were in old gallery but not in new gallery
                for (const oldImage of oldGallery) {
                    if (!newGallery.includes(oldImage) && oldImage.includes("cloudinary.com")) {
                        imagesToDelete.push(oldImage);
                    }
                }
            }

            // Delete orphaned images from Cloudinary
            for (const imageUrl of imagesToDelete) {
                const publicId = extractPublicIdFromUrl(imageUrl);
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                    console.log(`Deleted replaced Cloudinary image: ${publicId}`);
                }
            }
        } catch (cloudinaryError) {
            // Log but don't fail the request if cleanup fails
            console.warn("Could not clean up replaced images from Cloudinary:", cloudinaryError);
        }

        // Parse gallery back to array for response
        const response = {
            ...dog,
            gallery: dog.gallery ? JSON.parse(dog.gallery) : undefined,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error updating dog:", error);
        if (error instanceof Error && error.name === "ZodError") {
            return NextResponse.json(
                { error: "Validation failed", details: error },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Failed to update dog" },
            { status: 500 }
        );
    }
}

// DELETE /api/dogs/[id] - Delete a dog (admin only)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Get the dog record before deleting to access image paths
        const dog = await prisma.dog.findUnique({
            where: { id },
        });

        if (!dog) {
            return NextResponse.json({ error: "Dog not found" }, { status: 404 });
        }

        // Delete from database first
        await prisma.dog.delete({
            where: { id },
        });

        // Delete associated images from Cloudinary
        try {
            // Parse gallery images if they exist
            const galleryImages = dog.gallery ? JSON.parse(dog.gallery) : [];
            const allImages = [dog.image, ...galleryImages];

            // Delete each image from Cloudinary
            for (const imageUrl of allImages) {
                if (imageUrl && imageUrl.includes("cloudinary.com")) {
                    // Extract public_id from Cloudinary URL
                    // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}.{format}
                    const publicId = extractPublicIdFromUrl(imageUrl);
                    if (publicId) {
                        await cloudinary.uploader.destroy(publicId);
                        console.log(`Deleted Cloudinary image: ${publicId}`);
                    }
                }
            }
        } catch (cloudinaryError) {
            // Log but don't fail the request if images can't be deleted from Cloudinary
            console.warn("Could not delete images from Cloudinary:", cloudinaryError);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting dog:", error);
        return NextResponse.json(
            { error: "Failed to delete dog" },
            { status: 500 }
        );
    }
}

// Helper function to extract public_id from Cloudinary URL
function extractPublicIdFromUrl(url: string): string | null {
    try {
        // Cloudinary URL format:
        // https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{version}/{public_id}.{format}
        // or without transformations:
        // https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
        // or without version:
        // https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.{format}

        // Find the position after '/upload/'
        const uploadIndex = url.indexOf('/upload/');
        if (uploadIndex === -1) return null;

        // Get everything after '/upload/'
        const afterUpload = url.substring(uploadIndex + 8);

        // Remove the file extension
        const withoutExtension = afterUpload.replace(/\.[^.]+$/, '');

        // Remove version (v followed by digits and slash) if present
        const withoutVersion = withoutExtension.replace(/^v\d+\//, '');

        // Remove transformation parameters (anything before the actual path that contains commas or single letters followed by underscores)
        // Transformations look like: w_1200,h_1200,c_limit,q_auto,f_auto/
        const parts = withoutVersion.split('/');

        // Find the first part that looks like a folder path (contains letters and doesn't have transformation syntax)
        let publicIdStart = 0;
        for (let i = 0; i < parts.length; i++) {
            // If part contains transformation syntax (like w_, h_, c_, q_, f_) or only commas, skip it
            if (!/^[a-z]_/.test(parts[i]) && !/,/.test(parts[i])) {
                publicIdStart = i;
                break;
            }
        }

        // Join the remaining parts to form the public_id
        const publicId = parts.slice(publicIdStart).join('/');

        return publicId || null;
    } catch (error) {
        console.error("Error extracting public_id from URL:", error);
        return null;
    }
}
