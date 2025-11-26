"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/app/i18n/LocaleProvider";

// Hook to persist scroll position across locale switches
export function useFilterPersistence() {
  const { locale } = useI18n();
  const prevLocaleRef = useRef<string | undefined>();

  useEffect(() => {
    // Restore scroll position after locale change (only if locale changed)
    if (prevLocaleRef.current !== undefined && prevLocaleRef.current !== locale) {
      const savedScroll = sessionStorage.getItem("scrollPosition");
      if (savedScroll) {
        window.scrollTo(0, parseInt(savedScroll, 10));
      }
    }
    prevLocaleRef.current = locale;

    // Save scroll position before locale changes (on cleanup)
    return () => {
      sessionStorage.setItem("scrollPosition", String(window.scrollY));
    };
  }, [locale]);
}

export function saveFilterState(filters: {
  query: string;
  breed: string;
  ageGroup: string;
}) {
  sessionStorage.setItem("dogFilters", JSON.stringify(filters));
}

export function loadFilterState(): {
  query: string;
  breed: string;
  ageGroup: string;
} | null {
  const saved = sessionStorage.getItem("dogFilters");
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}
