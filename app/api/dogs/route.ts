import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { dogSchema } from "@/lib/validations";

// GET /api/dogs - Get all dogs
export async function GET() {
    try {
        const dogs = await prisma.dog.findMany({
            orderBy: { name: "asc" },
        });

        // Parse gallery JSON strings to arrays
        const parsedDogs = dogs.map((dog: typeof dogs[number]): typeof dog & { gallery?: string[] } => ({
            ...dog,
            gallery: dog.gallery ? JSON.parse(dog.gallery) : undefined,
        }));

        return NextResponse.json(parsedDogs);
    } catch (error) {
        console.error("Error fetching dogs:", error);
        return NextResponse.json(
            { error: "Failed to fetch dogs" },
            { status: 500 }
        );
    }
}

// POST /api/dogs - Create a new dog (admin only)
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const validatedData = dogSchema.parse(body);

        // Serialize gallery array to JSON string for SQLite
        const dataToStore = {
            ...validatedData,
            gallery: validatedData.gallery ? JSON.stringify(validatedData.gallery) : undefined,
        };

        const dog = await prisma.dog.create({
            data: dataToStore,
        });

        // Parse gallery back to array for response
        const response = {
            ...dog,
            gallery: dog.gallery ? JSON.parse(dog.gallery) : undefined,
        };

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        console.error("Error creating dog:", error);
        if (error instanceof Error && error.name === "ZodError") {
            return NextResponse.json(
                { error: "Validation failed", details: error },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Failed to create dog" },
            { status: 500 }
        );
    }
}
