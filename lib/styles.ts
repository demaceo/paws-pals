// Reusable Tailwind class constants for consistency across components

export const buttonStyles = {
  primary: "rounded-full bg-linear-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:shadow-xl hover:shadow-orange-500/40 hover:from-orange-600 hover:to-orange-700 dark:from-orange-500 dark:to-orange-600 dark:shadow-orange-600/20 dark:hover:shadow-orange-600/30",
  primarySmall: "rounded-full bg-linear-to-r from-orange-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-500/30 transition hover:shadow-lg hover:from-orange-600 hover:to-orange-700",
  secondary: "rounded-full border-2 border-orange-200 bg-white px-6 py-3 text-sm font-semibold text-orange-950 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 dark:border-orange-900/50 dark:bg-zinc-900 dark:text-orange-100 dark:hover:border-orange-800 dark:hover:bg-zinc-800",
} as const;

export const inputStyles = {
  base: "w-full rounded-xl border-2 border-orange-200 bg-white px-3 py-2.5 text-sm outline-none ring-0 placeholder:text-zinc-400 transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-orange-900/50 dark:bg-zinc-950 dark:focus:border-orange-500 dark:focus:ring-orange-900/30",
} as const;

export const cardStyles = {
  base: "rounded-2xl border border-orange-100 bg-white shadow-md shadow-orange-100/20 dark:border-orange-900/30 dark:bg-zinc-900 dark:shadow-orange-950/20",
  interactive: "rounded-2xl border border-orange-100 bg-white shadow-md shadow-orange-100/20 transition hover:shadow-xl hover:shadow-orange-200/30 hover:border-orange-200 dark:border-orange-900/30 dark:bg-zinc-900 dark:shadow-orange-950/20 dark:hover:border-orange-800/50 dark:hover:shadow-orange-900/30",
  gradient: "rounded-2xl border border-orange-100 bg-linear-to-br from-white to-orange-50/20 p-5 shadow-lg shadow-orange-100/20 dark:border-orange-900/30 dark:from-zinc-900 dark:to-orange-950/10 dark:shadow-orange-950/20",
} as const;

export const badgeStyles = {
  orange: "rounded-full bg-linear-to-r from-orange-500 to-orange-600 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-orange-500/40 backdrop-blur",
  white: "rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-orange-900 shadow-lg shadow-black/10 backdrop-blur ring-1 ring-orange-200/50",
} as const;

export const stepBadgeStyles = {
  orange: "inline-flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-orange-500 to-orange-600 text-sm font-bold text-white shadow-md shadow-orange-500/30",
  purple: "inline-flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-purple-600 text-sm font-bold text-white shadow-md shadow-purple-500/30",
  emerald: "inline-flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-emerald-600 text-sm font-bold text-white shadow-md shadow-emerald-500/30",
} as const;
