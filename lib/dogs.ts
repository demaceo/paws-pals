import { prisma } from "./prisma";

export type Dog = {
  id: string;
  name: string;
  breed: string;
  age: string; // e.g., "2 years", "8 months"
  sex: "Male" | "Female";
  size: "Small" | "Medium" | "Large";
  location: string;
  description: string;
  image: string;
  gallery?: string[];
};

// Legacy static data has been migrated to database
// All data now managed through admin dashboard
// Original 9 dogs seeded into database via prisma/seed.ts

// Database queries
export async function getDogs(): Promise<Dog[]> {
  const dogs = await prisma.dog.findMany({
    orderBy: { name: "asc" },
  });
  // Parse gallery JSON string to array
  return dogs.map((dog: typeof dogs[number]): Dog => ({
    id: dog.id,
    name: dog.name,
    breed: dog.breed,
    age: dog.age,
    sex: dog.sex as "Male" | "Female",
    size: dog.size as "Small" | "Medium" | "Large",
    location: dog.location,
    description: dog.description,
    image: dog.image,
    gallery: dog.gallery ? JSON.parse(dog.gallery) : undefined,
  }));
}

export async function getDog(id: string): Promise<Dog | null> {
  const dog = await prisma.dog.findUnique({
    where: { id },
  });
  if (!dog) return null;
  // Parse gallery JSON string to array
  return {
    id: dog.id,
    name: dog.name,
    breed: dog.breed,
    age: dog.age,
    sex: dog.sex as "Male" | "Female",
    size: dog.size as "Small" | "Medium" | "Large",
    location: dog.location,
    description: dog.description,
    image: dog.image,
    gallery: dog.gallery ? JSON.parse(dog.gallery) : undefined,
  };
}
