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
  );
}
