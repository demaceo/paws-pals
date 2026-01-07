import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;
        const dogName = formData.get("dogName") as string;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (!dogName) {
            return NextResponse.json(
                { error: "Dog name is required" },
                { status: 400 }
            );
        }

        // Validate file type
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed" },
                { status: 400 }
            );
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "File size exceeds 5MB limit" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create directory for dog if it doesn't exist
        const dogFolder = path.join(process.cwd(), "public", "dogs", dogName);
        await mkdir(dogFolder, { recursive: true });

        // Generate unique filename
        const extension = file.name.split(".").pop();
        const filename = `${uuidv4()}.${extension}`;
        const filepath = path.join(dogFolder, filename);

        // Write file
        await writeFile(filepath, buffer);

        // Return relative path for storing in database
        const relativePath = `/dogs/${dogName}/${filename}`;

        return NextResponse.json({ path: relativePath });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { error: "Failed to upload file" },
            { status: 500 }
        );
    }
}
