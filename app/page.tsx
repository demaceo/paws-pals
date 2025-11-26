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
    <div className="bg-zinc-50 pb-20 pt-10 dark:bg-black">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-10">
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
                className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
              >
                {m["hero.explore"]}
              </a>
              <Link
                href="#how-it-works"
                className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                {m["hero.how"]}
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
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
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          {m["how.title"]}
        </h2>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          {m["how.subtitle"]}
        </p>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          <li className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
                1
              </span>
              <h3 className="font-medium">{m["how.1.title"]}</h3>
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {m["how.1.desc"]}
            </p>
          </li>
          <li className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
                2
              </span>
              <h3 className="font-medium">{m["how.2.title"]}</h3>
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {m["how.2.desc"]}
            </p>
          </li>
          <li className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
                3
              </span>
              <h3 className="font-medium">{m["how.3.title"]}</h3>
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
