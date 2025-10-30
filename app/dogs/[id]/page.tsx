import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDog, getDogs } from "@/lib/dogs";
import AdoptionModal from "@/app/components/AdoptionModal";
import { getLocale, getMessages, type Locale } from "@/lib/i18n";

export async function generateStaticParams() {
  return getDogs().map((d) => ({ id: d.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>; // Next.js 16 dynamic APIs
}) {
  const { id } = await params;
  const dog = getDog(id);
  return {
    title: dog ? `${dog.name} • ${dog.breed}` : "Dog not found",
    description: dog?.description ?? "Dog profile",
  };
}

export default async function DogPage({
  params,
}: {
  params: Promise<{ id: string }>; // Next.js 16 dynamic APIs
}) {
  const { id } = await params;
  const dog = getDog(id);
  if (!dog) return notFound();

  const gallery = dog.gallery && dog.gallery.length > 0 ? dog.gallery : [dog.image];
  const locale = await getLocale();
  const m = getMessages(locale);

  type ActionState = { ok: boolean; error?: string; dogName?: string };

  async function adoptAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
    "use server";
    const submittedLocale = (String(formData.get("locale") || locale) as Locale) || "en";
    const mm = getMessages(submittedLocale);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const dogId = String(formData.get("dogId") || "");
    const dogName = String(formData.get("dogName") || "this dog");

    // Basic server validation
    if (!name || !email) return { ok: false, error: mm["form.error.required"] };
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) return { ok: false, error: mm["form.error.phone"] };

    // Simulate persistence; swap with real integration later
    console.log("Adoption inquiry", { dogId, name, email, phone, message });
    return { ok: true, dogName };
  }

  return (
    <div className="bg-zinc-50 pb-20 pt-10 dark:bg-black">
      <section className="mx-auto max-w-6xl px-6">
        <nav className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          <Link className="hover:underline" href="/">← {m["nav.backList"]}</Link>
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
                  unoptimized
                />
              </div>
              {gallery.length > 1 && (
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {gallery.slice(0, 4).map((src, i) => (
                    <div key={i} className="relative aspect-4/3 w-full overflow-hidden rounded-xl">
                      <Image src={src} alt={`${dog.name} ${i + 1}`} fill sizes="25vw" className="object-cover" unoptimized />
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
                  <dt className="text-zinc-500">{m["dog.age"]}</dt>
                  <dd className="font-medium">{dog.age}</dd>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <dt className="text-zinc-500">{m["dog.sex"]}</dt>
                  <dd className="font-medium">{dog.sex}</dd>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <dt className="text-zinc-500">{m["dog.size"]}</dt>
                  <dd className="font-medium">{dog.size}</dd>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <dt className="text-zinc-500">{m["dog.location"]}</dt>
                  <dd className="font-medium">{dog.location}</dd>
                </div>
              </dl>

              <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-zinc-500">{m["dog.about"].replace("{name}", dog.name)}</h2>
              <p className="mt-2 whitespace-pre-line text-base leading-7 text-zinc-700 dark:text-zinc-300">
                {dog.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <AdoptionModal dog={dog} action={adoptAction} />
                <a
                  href="#visit"
                  className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-white/15 dark:bg-zinc-950 dark:text-zinc-50"
                >
                  {m["dog.book"]}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
