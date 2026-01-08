import Image from "next/image";
import Link from "next/link";
import { format, type Messages } from "@/lib/i18n-messages";

type Props = {
  messages: Messages;
};

export default function SiteFooter({ messages: m }: Props) {
  return (
    <footer className="relative mt-20 border-t border-orange-100/80 bg-linear-to-b from-white via-orange-50/30 to-orange-50/50 py-16 text-zinc-700 backdrop-blur-sm dark:border-orange-900/30 dark:from-zinc-950 dark:via-zinc-950 dark:to-orange-950/20 dark:text-zinc-300">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Mission Section */}
          <div className="lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <Image
                src="/oaat-logo.png"
                alt="One At A Time Rescue"
                width={44}
                height={44}
                className="h-11 w-11"
              />
              <span className="text-xl font-bold text-zinc-900 dark:text-white">
                {m["brand.name"]}
              </span>
            </div>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {m["footer.mission"]}
            </p>
            {/* Newsletter */}
            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
                {m["footer.newsletter"]}
              </p>
              <form className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <input
                  type="email"
                  placeholder={m["footer.emailPlaceholder"]}
                  className="flex-1 rounded-xl border-2 border-orange-200 bg-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-zinc-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-orange-900/50 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-orange-600 dark:focus:ring-orange-900/40"
                />
                <button className="rounded-xl bg-linear-to-r from-orange-500 to-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 hover:from-orange-600 hover:to-orange-700 dark:from-orange-500 dark:to-orange-600 dark:shadow-orange-600/20 dark:hover:shadow-orange-600/30">
                  {m["footer.subscribe"]}
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/#dogs"
                  className="inline-flex items-center text-zinc-600 transition-colors hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400"
                >
                  {m["nav.dogs"]}
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="inline-flex items-center text-zinc-600 transition-colors hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400"
                >
                  {m["nav.how"]}
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex items-center text-zinc-600 transition-colors hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400"
                >
                  {m["footer.about"]}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex items-center text-zinc-600 transition-colors hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400"
                >
                  {m["footer.faq"]}
                </a>
              </li>
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Get Involved
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="inline-flex items-center text-zinc-600 transition-colors hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400"
                >
                  {m["footer.volunteer"]}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex items-center text-zinc-600 transition-colors hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400"
                >
                  {m["footer.donate"]}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex items-center text-zinc-600 transition-colors hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400"
                >
                  {m["footer.contact"]}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-orange-100/80 pt-8 text-center text-sm text-zinc-600 dark:border-orange-900/30 dark:text-zinc-400">
          <p>
            {format(m["footer.copyright"], {
              year: new Date().getFullYear(),
            })}
          </p>
        </div>
      </div>
    </footer>
  );
}
