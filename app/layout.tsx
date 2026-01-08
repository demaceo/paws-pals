import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getLocale } from "@/lib/i18n-server";
import { getMessages } from "@/lib/i18n-messages";
import LocaleProvider from "@/app/i18n/LocaleProvider";
import ThemeProvider from "@/app/components/ThemeProvider";
import ConditionalLayout from "@/app/components/ConditionalLayout";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";

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
              header={<SiteHeader messages={m} />}
              footer={<SiteFooter messages={m} />}
            >
              {children}
            </ConditionalLayout>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
