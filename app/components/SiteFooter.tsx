import Image from "next/image";
import Link from "next/link";
import { format, type Messages } from "@/lib/i18n-messages";

type Props = {
  messages: Messages;
};

export default function SiteFooter({ messages: m }: Props) {
  return (
    <footer className="relative mt-16 border-t border-orange-100/50 bg-linear-to-b from-white/60 to-orange-50/40 py-12 text-zinc-700 backdrop-blur-sm dark:border-orange-900/20 dark:from-black/60 dark:to-orange-950/20 dark:text-zinc-300">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Mission Section */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <Image
                src="/oaat-logo.png"
                alt="One At A Time Rescue"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="text-lg font-semibold text-zinc-900 dark:text-white">
                {m["brand.name"]}
              </span>
            </div>
            <p className="mb-4 max-w-md text-sm leading-relaxed">
              {m["footer.mission"]}
            </p>
            {/* Newsletter */}
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-zinc-900 dark:text-white">
                {m["footer.newsletter"]}
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder={m["footer.emailPlaceholder"]}
                  className="flex-1 rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm transition-colors focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200 dark:border-orange-900/40 dark:bg-black/40 dark:focus:border-orange-600 dark:focus:ring-orange-900/30"
                />
                <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700">
                  {m["footer.subscribe"]}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/#dogs"
                  className="transition-colors hover:text-orange-600 dark:hover:text-orange-400"
                >
                  {m["nav.dogs"]}
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="transition-colors hover:text-orange-600 dark:hover:text-orange-400"
                >
                  {m["nav.how"]}
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-orange-600 dark:hover:text-orange-400"
                >
                  {m["footer.about"]}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-orange-600 dark:hover:text-orange-400"
                >
                  {m["footer.faq"]}
                </a>
              </li>
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-900 dark:text-white">
              Get Involved
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-orange-600 dark:hover:text-orange-400"
                >
                  {m["footer.volunteer"]}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-orange-600 dark:hover:text-orange-400"
                >
                  {m["footer.donate"]}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-orange-600 dark:hover:text-orange-400"
                >
                  {m["footer.contact"]}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-orange-100/50 pt-6 text-center text-sm text-zinc-600 dark:border-orange-900/20 dark:text-zinc-400">
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
