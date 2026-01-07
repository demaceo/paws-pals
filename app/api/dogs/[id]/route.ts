import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { dogSchema } from "@/lib/validations";

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

        if (!dog) {
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
        const validatedData = dogSchema.parse(body);

        // Serialize gallery array to JSON string for SQLite
        const dataToStore = {
            ...validatedData,
            gallery: validatedData.gallery ? JSON.stringify(validatedData.gallery) : undefined,
        };

        const dog = await prisma.dog.update({
            where: { id },
            data: dataToStore,
        });

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
        await prisma.dog.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting dog:", error);
        return NextResponse.json(
            { error: "Failed to delete dog" },
            { status: 500 }
        );
    }
}
