import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AssessmentNotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
        <div className="flex flex-col items-center justify-center">
          <p className="font-mono text-lg font-semibold tracking-widest text-muted-foreground">
            404
          </p>
        </div>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          Assessment not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          This assessment doesn’t exist or you don’t have access to it.
        </p>
        <Link
          href="/interview"
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to interviews
        </Link>
      </div>
    </main>
  );
}
