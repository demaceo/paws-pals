import Link from "next/link";
import { getLocale } from "@/lib/i18n-server";
import { getMessages, format } from "@/lib/i18n-messages";

export default async function ThankYou({
  searchParams,
}: {
  searchParams: { dog?: string };
}) {
  const dog = searchParams?.dog ?? "this dog";
  const locale = await getLocale();
  const m = getMessages(locale);
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">
        {m["thanks.title"]}
      </h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        {format(m["thanks.body"], { dog })}
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
        >
          {m["thanks.back"]}
        </Link>
        <a
          href="mailto:support@pawsandpals.com"
          className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-50"
        >
          {m["thanks.contact"]}
        </a>
      </div>
    </div>
  );
}
