import Link from "next/link";
import DogExplorer from "./components/DogExplorer";
import { getDogs } from "@/lib/dogs";

export default function Home() {
  const dogs = getDogs();

  return (
    <div className="bg-zinc-50 pb-20 pt-10 dark:bg-black">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">
              Find your new best friend
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-7 text-zinc-600 dark:text-zinc-400">
              We’re on a mission to help 45 wonderful dogs find loving homes. Browse profiles,
              learn their stories, and start the adoption journey.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#dogs"
                className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
              >
                Explore dogs
              </a>
              <Link
                href="/"
                className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                Learn about adoption
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <dl className="grid grid-cols-3 gap-4 text-center">
              <div>
                <dt className="text-sm text-zinc-600 dark:text-zinc-400">Dogs listed</dt>
                <dd className="text-3xl font-semibold text-zinc-950 dark:text-zinc-50">{dogs.length}</dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-600 dark:text-zinc-400">Avg. age</dt>
                <dd className="text-3xl font-semibold text-zinc-950 dark:text-zinc-50">2.7y</dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-600 dark:text-zinc-400">Goal</dt>
                <dd className="text-3xl font-semibold text-zinc-950 dark:text-zinc-50">45</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <DogExplorer dogs={dogs} />
    </div>
  );
}
