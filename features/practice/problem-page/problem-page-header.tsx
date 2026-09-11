import { useRouter } from "next/navigation";
import { AccountButton } from "@/components/layout/account-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ChevronRight } from "lucide-react";


export function ProblemPageHeader({title}: {title: string}) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between border-b border-border px-6 py-2.5 bg-background">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => router.push("/practice")}
          className="text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          Practice
        </button>
        <ChevronRight size={14} className="text-muted-foreground/60" />
        <span className="font-semibold text-foreground">{title}</span>
      </div>

      {/* Right: Utilities */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <AccountButton />
      </div>
    </div>
  );
}
