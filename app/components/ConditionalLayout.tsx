"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function ConditionalLayout({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    // For admin routes, only render children (admin layout handles its own navigation)
    return <>{children}</>;
  }

  // For public routes, render header, main content, and footer
  return (
    <>
      {header}
      <main>{children}</main>
      {footer}
    </>
  );
}
