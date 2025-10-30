import Link from "next/link";

export default function ThankYou({ searchParams }: { searchParams: { dog?: string } }) {
  const dog = searchParams?.dog ?? "this dog";
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Thanks for your inquiry</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        We’ve received your request to adopt {dog}. Our team will reach out within 24–48 hours.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
        >
          Back to dogs
        </Link>
        <a
          href="#"
          className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-50"
        >
          Contact support
        </a>
      </div>
    </div>
  );
}
