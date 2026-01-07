import DogForm from "../../../components/DogForm";

export default function NewDogPage() {
  return (
    <div className="px-4 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Add New Dog
        </h1>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Fill in the details to add a new dog for adoption
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
        <DogForm mode="create" />
      </div>
    </div>
  );
}
