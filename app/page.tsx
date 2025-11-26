import Link from "next/link";
import DogExplorer from "./components/DogExplorer";
import { getDogs } from "@/lib/dogs";
import { getLocale } from "@/lib/i18n-server";
import { getMessages } from "@/lib/i18n-messages";

export default async function Home() {
  const dogs = getDogs();
  const locale = await getLocale();
  const m = getMessages(locale);

  return (
    <div className="relative pb-20 pt-10">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-orange-200/20 blur-3xl dark:bg-orange-500/10" />
        <div className="absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-purple-200/15 blur-3xl dark:bg-purple-500/8" />
        <div className="absolute bottom-20 right-1/4 h-72 w-72 rounded-full bg-emerald-200/15 blur-3xl dark:bg-emerald-500/8" />
      </div>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-6 py-10">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">
              {m["hero.title"]}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-7 text-zinc-600 dark:text-zinc-400">
              {m["hero.subtitle"]}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#dogs"
                className="rounded-full bg-linear-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:shadow-xl hover:shadow-orange-500/40 hover:from-orange-600 hover:to-orange-700 dark:from-orange-500 dark:to-orange-600 dark:shadow-orange-600/20 dark:hover:shadow-orange-600/30"
              >
                {m["hero.explore"]}
              </a>
              <Link
                href="#how-it-works"
                className="rounded-full border-2 border-orange-200 bg-white px-6 py-3 text-sm font-semibold text-orange-950 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 dark:border-orange-900/50 dark:bg-zinc-900 dark:text-orange-100 dark:hover:border-orange-800 dark:hover:bg-zinc-800"
              >
                {m["hero.how"]}
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-orange-100/50 bg-white/80 p-6 shadow-lg shadow-orange-100/30 backdrop-blur-sm ring-1 ring-orange-100/20 dark:border-orange-900/20 dark:bg-zinc-900/80 dark:shadow-orange-950/20 dark:ring-orange-900/10">
            <dl className="grid grid-cols-3 gap-4 text-center">
              <div>
                <dt className="text-sm text-zinc-600 dark:text-zinc-400">
                  {m["stats.dogs"]}
                </dt>
                <dd className="text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
                  {dogs.length}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-600 dark:text-zinc-400">
                  {m["stats.avgAge"]}
                </dt>
                <dd className="text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
                  2.7y
                </dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-600 dark:text-zinc-400">
                  {m["stats.goal"]}
                </dt>
                <dd className="text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
                  45
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="relative mx-auto max-w-7xl px-6 py-8"
      >
        <h2 className="text-2xl font-semibold tracking-tight">
          {m["how.title"]}
        </h2>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          {m["how.subtitle"]}
        </p>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          <li className="rounded-2xl border border-orange-100 bg-linear-to-br from-white to-orange-50/30 p-5 shadow-md shadow-orange-100/20 transition hover:shadow-lg dark:border-orange-900/30 dark:from-zinc-900 dark:to-orange-950/20 dark:shadow-orange-950/20">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-orange-500 to-orange-600 text-sm font-bold text-white shadow-md shadow-orange-500/30">
                1
              </span>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                {m["how.1.title"]}
              </h3>
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {m["how.1.desc"]}
            </p>
          </li>
          <li className="rounded-2xl border border-purple-100 bg-linear-to-br from-white to-purple-50/30 p-5 shadow-md shadow-purple-100/20 transition hover:shadow-lg dark:border-purple-900/30 dark:from-zinc-900 dark:to-purple-950/20 dark:shadow-purple-950/20">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-purple-600 text-sm font-bold text-white shadow-md shadow-purple-500/30">
                2
              </span>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                {m["how.2.title"]}
              </h3>
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {m["how.2.desc"]}
            </p>
          </li>
          <li className="rounded-2xl border border-emerald-100 bg-linear-to-br from-white to-emerald-50/30 p-5 shadow-md shadow-emerald-100/20 transition hover:shadow-lg dark:border-emerald-900/30 dark:from-zinc-900 dark:to-emerald-950/20 dark:shadow-emerald-950/20">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-emerald-600 text-sm font-bold text-white shadow-md shadow-emerald-500/30">
                3
              </span>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                {m["how.3.title"]}
              </h3>
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {m["how.3.desc"]}
            </p>
          </li>
        </ol>
      </section>

      <DogExplorer dogs={dogs} />
    </div>
  );
}
