import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
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

      {/* Adoption form */}
      <section id="adopt" className="mx-auto mt-10 max-w-6xl px-6">
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold tracking-tight">Start the adoption process</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Tell us a bit about you and your home. We’ll get back within 24–48 hours.
          </p>

          <form
            action={async (formData: FormData) => {
              "use server";
              // Basic validation
              const name = String(formData.get("name") || "").trim();
              const email = String(formData.get("email") || "").trim();
              const phone = String(formData.get("phone") || "").trim();
              const message = String(formData.get("message") || "").trim();
              const dogId = String(formData.get("dogId") || "");

              // Simulate persistence or send to an integration later
              console.log("Adoption inquiry", { dogId, name, email, phone, message });

              // Redirect to thank-you with context
              redirect(`/thank-you?dog=${encodeURIComponent(dog.name)}`);
            }}
            className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <input type="hidden" name="dogId" value={dog.id} />
            <div className="md:col-span-1">
              <label className="mb-1 block text-xs text-zinc-500" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                name="name"
                required
                placeholder="Jane Doe"
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-indigo-400 dark:border-white/15 dark:bg-zinc-950"
              />
            </div>
            <div className="md:col-span-1">
              <label className="mb-1 block text-xs text-zinc-500" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-indigo-400 dark:border-white/15 dark:bg-zinc-950"
              />
            </div>
            <div className="md:col-span-1">
              <label className="mb-1 block text-xs text-zinc-500" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="(555) 555-1234"
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-indigo-400 dark:border-white/15 dark:bg-zinc-950"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs text-zinc-500" htmlFor="message">
                Tell us about your home/environment
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Yard or nearby park? Any other pets? Daily schedule?"
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-indigo-400 dark:border-white/15 dark:bg-zinc-950"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 md:w-auto"
              >
                Submit inquiry
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
