import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getLocale } from "@/lib/i18n-server";
import { getMessages, format } from "@/lib/i18n-messages";
import LocaleProvider from "@/app/i18n/LocaleProvider";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LocaleProvider locale={locale} messages={m}>
          {/* Site Shell */}
          <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-black/60">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <Link href="/" className="flex items-center gap-2">
                <span
                  className="inline-block h-8 w-8 rounded-full bg-indigo-600"
                  aria-hidden
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
                <LanguageSwitcher />
                <Link
                  href="/#dogs"
                  className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
                >
                  {m["nav.adopt"]}
                </Link>
              </div>
            </div>
          </header>
          <main>{children}</main>
          <footer className="mt-16 border-t border-black/5 py-10 text-sm text-zinc-600 dark:border-white/10 dark:text-zinc-400">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
              <p>
                {format(m["footer.copyright"], {
                  year: new Date().getFullYear(),
                })}
              </p>
              <p>{m["footer.builtWith"]}</p>
            </div>
          </footer>
        </LocaleProvider>
      </body>
    </html>
  );
}
