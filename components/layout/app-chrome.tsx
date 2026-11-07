"use client";

import { usePathname } from "next/navigation";

import Header from "@/components/layout/header";

type AppChromeProps = {
  children: React.ReactNode;
};

export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const isProblemPage = pathname?.startsWith("/practice/") && pathname !== "/practice";
  const isHeroPage = pathname == "/"
  const isAssessmentPage = pathname?.startsWith("/interview/") && pathname !== "/interview"

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {isProblemPage || isHeroPage || isAssessmentPage ? null : <Header />}
      {children}
    </div>
  );
}
