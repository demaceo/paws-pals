"use client";

import { useEffect } from "react";
import { useI18n } from "@/app/i18n/LocaleProvider";

// Component to persist filter state across locale switches
export function useFilterPersistence() {
  const { locale } = useI18n();

  useEffect(() => {
    // Save current scroll position before locale change
    const scrollY = window.scrollY;
    sessionStorage.setItem("scrollPosition", String(scrollY));

    // Restore scroll position after locale change
    const savedScroll = sessionStorage.getItem("scrollPosition");
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll, 10));
    }
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
