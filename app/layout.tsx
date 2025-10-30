import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Paws & Pals — Adopt a Dog",
    template: "%s — Paws & Pals",
  },
  description:
    "Discover lovable dogs from our partner sanctuary. Browse, learn more, and start the adoption journey.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Site Shell */}
        <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-black/60">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="inline-block h-8 w-8 rounded-full bg-indigo-600" aria-hidden />
              <span className="text-lg font-semibold tracking-tight">Paws & Pals</span>
            </Link>
            <nav className="hidden items-center gap-6 text-sm md:flex">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <a href="#dogs" className="hover:underline">
                Dogs
              </a>
              <a
                href="#how-it-works"
                className="hidden hover:underline lg:block"
              >
                How it works
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <a
                href="#adopt"
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
              >
                Adopt
              </a>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 border-t border-black/5 py-10 text-sm text-zinc-600 dark:border-white/10 dark:text-zinc-400">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
            <p>© {new Date().getFullYear()} Paws & Pals. All rights reserved.</p>
            <p>
              Built with <a className="underline" href="https://nextjs.org">Next.js</a>
              {" "}and <a className="underline" href="https://tailwindcss.com">Tailwind CSS</a>.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
