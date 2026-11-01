import { ShieldCheck } from "lucide-react";

export default function Guidelines() {
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-7">
        <div className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Interview protocol
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Show how you think.
        </h2>
      </div>
      <div className="space-y-3">
        {[
          [
            "Think out loud",
            "Explain your assumptions and the tradeoffs behind your approach.",
          ],
          [
            "Start with a plan",
            "Describe the algorithm before translating it into code.",
          ],
          [
            "Test edge cases",
            "Consider empty input, one character, spaces, and repeated symbols.",
          ],
          [
            "Watch complexity",
            "State the time and space complexity of your final solution.",
          ],
        ].map(([title, text], index) => (
          <div key={title} className="flex gap-4 border-b border-border py-4">
            <span className="font-mono text-xs text-muted-foreground">
              0{index + 1}
            </span>
            <div>
              <h3 className="mb-1 text-sm font-semibold">{title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-7 flex gap-3 rounded-lg bg-emerald-500/8 p-4 text-sm text-emerald-800 dark:text-emerald-200">
        <ShieldCheck className="mt-0.5 size-5 shrink-0" />
        <p className="leading-6">
          Your code is saved locally as you type. Refreshing the page will not
          reset the timer.
        </p>
      </div>
    </div>
  );
}
