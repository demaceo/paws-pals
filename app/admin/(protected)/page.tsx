import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DogManagementTable, { type Dog as ManagementDog } from "../components/DogManagementTable";

export default async function AdminDashboardPage() {
  const dbDogs = await prisma.dog.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      breed: true,
      age: true,
      sex: true,
      size: true,
      status: true,
      location: true,
      image: true,
      description: true,
    },
  });

  const dogs: ManagementDog[] = dbDogs.map((dog) => ({
    id: dog.id,
    name: dog.name,
    breed: dog.breed,
    age: dog.age,
    sex: dog.sex as ManagementDog["sex"],
    size: dog.size as ManagementDog["size"],
    status: dog.status as ManagementDog["status"],
    location: dog.location,
    image: dog.image,
    description: dog.description,
  }));

  return (
    <div className="px-4 sm:px-0">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dog Management
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage all dogs available for adoption
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/dogs/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            + Add New Dog
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        {dogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No dogs found. Add your first dog to get started.
            </p>
          </div>
        ) : (
          <DogManagementTable dogs={dogs} />
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              Total Dogs
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
              {dogs.length}
            </dd>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              Males
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
              {dogs.filter((d) => d.sex === "Male").length}
            </dd>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              Females
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
              {dogs.filter((d) => d.sex === "Female").length}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}
