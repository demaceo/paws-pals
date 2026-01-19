import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminInbox from "./components/AdminInbox";
import { buttonStyles } from "@/lib/styles";

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
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-black">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-12 top-10 h-64 w-64 rounded-full bg-orange-200/30 blur-3xl dark:bg-orange-500/10" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl dark:bg-orange-800/10" />
      </div>

      <nav className="sticky top-0 z-40 border-b border-orange-100/70 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-gray-800 dark:bg-gray-950/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-5">
              <Link
                href="/admin"
                className="group inline-flex items-center gap-3 rounded-full border border-orange-100/80 bg-orange-50/80 px-3 py-2 text-orange-900 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-orange-100"
              >
                <span className="text-lg leading-none">🐾</span>
                <div className="leading-tight">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-orange-500 dark:text-orange-300">
                    Shelter Console
                  </p>
                  <p className="text-sm font-semibold">Admin</p>
                </div>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                <Link
                  href="/admin"
                  className="rounded-full px-3 py-2 text-sm font-medium text-gray-800 transition hover:bg-orange-50 hover:text-orange-700 dark:text-gray-100 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/dogs/new"
                  className="rounded-full px-3 py-2 text-sm font-medium text-gray-800 transition hover:bg-orange-50 hover:text-orange-700 dark:text-gray-100 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  Add Dog
                </Link>
                <Link
                  href="/"
                  className="rounded-full px-3 py-2 text-sm font-medium text-gray-800 transition hover:bg-orange-50 hover:text-orange-700 dark:text-gray-100 dark:hover:bg-white/5 dark:hover:text-white"
                  target="_blank"
                >
                  View Site
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <AdminInbox />
              <span className="hidden sm:inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200/70 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700">
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
                  className={buttonStyles.primarySmall}
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
