import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DogForm from "../../../../components/DogForm";

export default async function EditDogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const dog = await prisma.dog.findUnique({
    where: { id },
  });

  if (!dog) {
    notFound();
  }

  // Transform database data to match DogFormData types
  const dogFormData = {
    id: dog.id,
    name: dog.name,
    breed: dog.breed,
    age: dog.age,
    sex: dog.sex as "Male" | "Female",
    size: dog.size as "Small" | "Medium" | "Large",
    status: dog.status,
    location: dog.location,
    description: dog.description,
    image: dog.image,
    gallery: dog.gallery ? JSON.parse(dog.gallery) : [],
  };

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Edit Dog: {dog.name}
        </h1>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Update the details for this dog
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
        <DogForm mode="edit" initialData={dogFormData} />
      </div>
    </div>
  );
}
