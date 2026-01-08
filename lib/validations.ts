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
    status: z.enum(["Available", "Pending", "Adopted"]).default("Available"),
    location: z.string().min(1, "Location is required").max(200),
    description: z.string().min(10, "Description must be at least 10 characters"),
    image: z.string().min(1, "Primary image is required"),
    gallery: z.array(z.string()).optional().default([]),
});

export const dogUpdateSchema = z
    .object({
        name: z.string().min(1, "Name is required").max(100).optional(),
        breed: z.string().min(1, "Breed is required").max(200).optional(),
        age: z.string().min(1, "Age is required").max(50).optional(),
        sex: z.enum(["Male", "Female"]).optional(),
        size: z.enum(["Small", "Medium", "Large"]).optional(),
        status: z.enum(["Available", "Pending", "Adopted"]).optional(),
        location: z.string().min(1, "Location is required").max(200).optional(),
        description: z
            .string()
            .min(10, "Description must be at least 10 characters")
            .optional(),
        image: z.string().min(1, "Primary image is required").optional(),
        gallery: z.array(z.string()).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: "No fields to update",
    });

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type DogInput = z.infer<typeof dogSchema>;
export type DogUpdateInput = z.infer<typeof dogUpdateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
