"use client";

import { usePathname } from "next/navigation";

import Header from "./header";

type AppChromeProps = {
  children: React.ReactNode;
};

export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const isProblemPage = pathname?.startsWith("/practice/") && pathname !== "/practice";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {isProblemPage ? null : <Header />}
      {children}
    </div>
  );
}
