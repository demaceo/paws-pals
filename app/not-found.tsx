import Link from "next/link";
import { getLocale } from "@/lib/i18n-server";
import { getMessages } from "@/lib/i18n-messages";

export default async function NotFound() {
  const locale = await getLocale();
  const m = getMessages(locale);
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">
        {m["404.title"]}
      </h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">{m["404.body"]}</p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
      >
        {m["404.back"]}
      </Link>
    </div>
  );
}
