import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDog, getDogs } from "@/lib/dogs";

type Props = {
  params: { id: string };
};

export async function generateStaticParams() {
  return getDogs().map((d) => ({ id: d.id }));
}

export function generateMetadata({ params }: Props) {
  const dog = getDog(params.id);
  return {
    title: dog ? `${dog.name} • ${dog.breed}` : "Dog not found",
    description: dog?.description ?? "Dog profile",
  };
}

export default function DogPage({ params }: Props) {
  const dog = getDog(params.id);
  if (!dog) return notFound();

  const gallery = dog.gallery && dog.gallery.length > 0 ? dog.gallery : [dog.image];

  return (
    <div className="bg-zinc-50 pb-20 pt-10 dark:bg-black">
      <section className="mx-auto max-w-6xl px-6">
        <nav className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          <Link className="hover:underline" href="/">← Back to list</Link>
        </nav>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Gallery */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-3xl border border-black/5 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-zinc-900">
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl">
                <Image
                  src={dog.image}
                  alt={dog.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
              {gallery.length > 1 && (
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {gallery.slice(0, 4).map((src, i) => (
                    <div key={i} className="relative aspect-4/3 w-full overflow-hidden rounded-xl">
                      <Image src={src} alt={`${dog.name} ${i + 1}`} fill sizes="25vw" className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                {dog.name}
              </h1>
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">{dog.breed}</p>

              <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <dt className="text-zinc-500">Age</dt>
                  <dd className="font-medium">{dog.age}</dd>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <dt className="text-zinc-500">Sex</dt>
                  <dd className="font-medium">{dog.sex}</dd>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <dt className="text-zinc-500">Size</dt>
                  <dd className="font-medium">{dog.size}</dd>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <dt className="text-zinc-500">Location</dt>
                  <dd className="font-medium">{dog.location}</dd>
                </div>
              </dl>

              <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                About {dog.name}
              </h2>
              <p className="mt-2 whitespace-pre-line text-base leading-7 text-zinc-700 dark:text-zinc-300">
                {dog.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#adopt"
                  className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
                >
                  Start adoption
                </a>
                <a
                  href="#visit"
                  className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-white/15 dark:bg-zinc-950 dark:text-zinc-50"
                >
                  Book a visit
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
