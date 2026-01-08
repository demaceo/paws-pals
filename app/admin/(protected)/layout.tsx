import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminInbox from "./components/AdminInbox";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                href="/admin"
                className="flex items-center px-2 text-xl font-bold text-orange-600"
              >
                🐾 Admin
              </Link>
              <div className="ml-6 flex space-x-4">
                <Link
                  href="/admin"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 dark:text-white hover:text-orange-600"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/dogs/new"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 dark:text-white hover:text-orange-600"
                >
                  Add Dog
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 dark:text-white hover:text-orange-600"
                  target="_blank"
                >
                  View Site
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <AdminInbox />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {session.user?.email}
              </span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/admin/login" });
                }}
              >
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
