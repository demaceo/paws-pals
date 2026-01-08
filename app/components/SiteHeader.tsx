import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import ThemeToggle from "@/app/components/ThemeToggle";
import { buttonStyles } from "@/lib/styles";
import type { Messages } from "@/lib/i18n-messages";

type Props = {
  messages: Messages;
};

export default function SiteHeader({ messages: m }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-orange-100/80 bg-white/95 shadow-sm backdrop-blur-xl transition-all dark:border-orange-900/30 dark:bg-zinc-950/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-3.5">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <Image
            src="/oaat-logo.png"
            alt="One At A Time Rescue"
            width={36}
            height={36}
            className="h-9 w-9"
          />
          <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-white md:text-lg">
            {m["brand.name"]}
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link
            href="/"
            className="text-zinc-700 transition-colors hover:text-orange-600 dark:text-zinc-300 dark:hover:text-orange-400"
          >
            {m["nav.home"]}
          </Link>
          <Link
            href="/#dogs"
            className="text-zinc-700 transition-colors hover:text-orange-600 dark:text-zinc-300 dark:hover:text-orange-400"
          >
            {m["nav.dogs"]}
          </Link>
          <Link
            href="/#how-it-works"
            className="hidden text-zinc-700 transition-colors hover:text-orange-600 dark:text-zinc-300 dark:hover:text-orange-400 lg:block"
          >
            {m["nav.how"]}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <Link href="/#dogs" className={buttonStyles.primarySmall}>
            {m["nav.adopt"]}
          </Link>
        </div>
      </div>
    </header>
  );
}
