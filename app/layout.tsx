import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getLocale } from "@/lib/i18n-server";
import { getMessages, format } from "@/lib/i18n-messages";
import LocaleProvider from "@/app/i18n/LocaleProvider";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import ThemeProvider from "@/app/components/ThemeProvider";
import ThemeToggle from "@/app/components/ThemeToggle";
import { buttonStyles } from "@/lib/styles";
import ConditionalLayout from "@/app/components/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const m = getMessages(locale);

  return {
    title: {
      default: m["brand.name"] + " — " + m["nav.adopt"],
      template: "%s — " + m["brand.name"],
    },
    description: m["hero.subtitle"],
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const m = getMessages(locale);

  return (
    <html lang={locale}>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <LocaleProvider locale={locale} messages={m}>
            <ConditionalLayout
              header={
                <header className="sticky top-0 z-50 border-b border-orange-100/50 bg-white/90 shadow-sm backdrop-blur-xl dark:border-orange-900/20 dark:bg-black/80">
                  <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link href="/" className="flex items-center gap-2">
                      <Image
                        src="/oaat-logo.png"
                        alt="One At A Time Rescue"
                        width={32}
                        height={32}
                        className="h-8 w-8"
                      />
                      <span className="text-lg font-semibold tracking-tight">
                        {m["brand.name"]}
                      </span>
                    </Link>
                    <nav className="hidden items-center gap-6 text-sm md:flex">
                      <Link href="/" className="hover:underline">
                        {m["nav.home"]}
                      </Link>
                      <Link href="/#dogs" className="hover:underline">
                        {m["nav.dogs"]}
                      </Link>
                      <Link
                        href="/#how-it-works"
                        className="hidden hover:underline lg:block"
                      >
                        {m["nav.how"]}
                      </Link>
                    </nav>
                    <div className="flex items-center gap-3">
                      <ThemeToggle />
                      <LanguageSwitcher />
                      <Link href="/#dogs" className={buttonStyles.primarySmall}>
                        {m["nav.adopt"]}
                      </Link>
                    </div>
                  </div>
                </header>
              }
              footer={
                <footer className="relative mt-16 border-t border-orange-100/50 bg-gradient-to-b from-white/60 to-orange-50/40 py-12 text-zinc-700 backdrop-blur-sm dark:border-orange-900/20 dark:from-black/60 dark:to-orange-950/20 dark:text-zinc-300">
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
              }
            >
              {children}
            </ConditionalLayout>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
