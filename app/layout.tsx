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
          <header className="sticky top-0 z-50 border-b border-orange-100/50 bg-white/90 shadow-sm backdrop-blur-xl dark:border-orange-900/20 dark:bg-black/80">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <Link href="/" className="flex items-center gap-2">
                <span
                  className="inline-block h-8 w-8 rounded-full bg-linear-to-br from-orange-500 to-orange-600 shadow-md shadow-orange-500/30"
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
                  className="rounded-full bg-linear-to-r from-orange-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-500/30 transition hover:shadow-lg hover:from-orange-600 hover:to-orange-700"
                >
                  {m["nav.adopt"]}
                </Link>
              </div>
            </div>
          </header>
          <main>{children}</main>
          <footer className="relative mt-16 border-t border-orange-100/50 bg-white/40 py-10 text-sm text-zinc-600 backdrop-blur-sm dark:border-orange-900/20 dark:bg-black/40 dark:text-zinc-400">
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
