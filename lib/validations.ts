import { z } from "zod";

export const dogSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    breed: z.string().min(1, "Breed is required").max(200),
    age: z.string().min(1, "Age is required").max(50),
    sex: z.enum(["Male", "Female"], {
        message: "Sex is required",
    }),
    size: z.enum(["Small", "Medium", "Large"], {
        message: "Size is required",
    }),
    location: z.string().min(1, "Location is required").max(200),
    description: z.string().min(10, "Description must be at least 10 characters"),
    image: z.string().min(1, "Primary image is required"),
    gallery: z.array(z.string()).optional().default([]),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type DogInput = z.infer<typeof dogSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
