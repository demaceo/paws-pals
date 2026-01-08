import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDog, getDogs } from "@/lib/dogs";
import AdoptionModal from "@/app/components/AdoptionModal";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n-server";
import { getMessages, format, type Locale } from "@/lib/i18n-messages";
import { translateAttribute, translateAge } from "@/lib/i18n-helpers";

export async function generateStaticParams() {
  const dogs = await getDogs();
  return dogs.map((d) => ({ id: d.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dog = await getDog(id);
  const locale = await getLocale();
  const m = getMessages(locale);

  if (!dog) {
    return {
      title: m["404.title"],
      description: m["404.body"],
    };
  }

  return {
    title: `${dog.name} • ${dog.breed}`,
    description: dog.description.slice(0, 155),
  };
}

export default async function DogPage({
  params,
}: {
  params: Promise<{ id: string }>; // Next.js 16 dynamic APIs
}) {
  const { id } = await params;
  const dog = await getDog(id);
  if (!dog) return notFound();

  const gallery =
    dog.gallery && dog.gallery.length > 0 ? dog.gallery : [dog.image];
  const locale = await getLocale();
  const m = getMessages(locale);

  type ActionState = { ok: boolean; error?: string; dogName?: string };

  async function adoptAction(
    _prevState: ActionState,
    formData: FormData
  ): Promise<ActionState> {
    "use server";
    const submittedLocale = String(formData.get("locale") || locale) as Locale;
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

    try {
      await prisma.inquiry.create({
        data: {
          dogId,
          dogName,
          name,
          email,
          phone,
          message: message || null,
          locale: submittedLocale,
        },
      });
    } catch (error) {
      console.error("Failed to save inquiry", error);
      return { ok: false, error: mm["form.error.save"] };
    }

    return { ok: true, dogName };
  }

  return (
    <div className="bg-zinc-50 pb-20 pt-10 dark:bg-zinc-950">
      <section className="mx-auto max-w-6xl px-6">
        <nav className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          <Link className="hover:underline" href="/">
            ← {m["nav.backList"]}
          </Link>
        </nav>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Gallery */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white p-2 shadow-sm dark:border-orange-900/30 dark:bg-zinc-800">
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
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
                    <div
                      key={i}
                      className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900"
                    >
                      <Image
                        src={src}
                        alt={`${dog.name} ${i + 1}`}
                        fill
                        sizes="25vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm dark:border-orange-900/30 dark:bg-zinc-800">
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                {dog.name}
              </h1>
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                {dog.breed}
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900/60">
                  <dt className="text-zinc-500 dark:text-zinc-400">
                    {m["dog.age"]}
                  </dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                    {translateAge(dog.age, m)}
                  </dd>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900/60">
                  <dt className="text-zinc-500 dark:text-zinc-400">
                    {m["dog.sex"]}
                  </dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                    {translateAttribute(dog.sex, m)}
                  </dd>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900/60">
                  <dt className="text-zinc-500 dark:text-zinc-400">
                    {m["dog.size"]}
                  </dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                    {translateAttribute(dog.size, m)}
                  </dd>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900/60">
                  <dt className="text-zinc-500 dark:text-zinc-400">
                    {m["dog.location"]}
                  </dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                    {dog.location}
                  </dd>
                </div>
              </dl>

              <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {format(m["dog.about"], { name: dog.name })}
              </h2>
              <p className="mt-2 whitespace-pre-line text-base leading-7 text-zinc-700 dark:text-zinc-300">
                {dog.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <AdoptionModal dog={dog} action={adoptAction} />
                <a
                  href="#visit"
                  className="rounded-full border-2 border-orange-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 dark:border-orange-900/50 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:border-orange-800 dark:hover:bg-zinc-800"
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
