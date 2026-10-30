export default function InterviewTips() {
  return (
    <div className="flex flex-col border border-border p-6 gap-4 rounded-lg bg-linear-to-bl from-slate-200 via-slate-300 to-orange-400/50 dark:from-zinc-800 dark:via-zinc-900/80 dark:to-orange-600/30">
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        Interview Tips
      </h2>
        <ul className="space-y-2">
            <li className="text-sm text-muted-foreground">
                <span className="text-emerald-500 mr-2 font-bold">✓</span>
                <span>Think out loud to demonstrate your thought process</span>
            </li>
            <li className="text-sm text-muted-foreground">
                <span className="text-emerald-500 mr-2 font-bold">✓</span>
                <span>Start with a brute force solution, then optimize</span>
            </li>
            <li className="text-sm text-muted-foreground">
                <span className="text-emerald-500 mr-2 font-bold">✓</span>
                <span>Test your code with edge cases</span>
            </li>
            <li className="text-sm text-muted-foreground">
                <span className="text-emerald-500 mr-2 font-bold">✓</span>
                <span>Ask clarifying questions before coding</span>
            </li>
        </ul>
      </div>
  );
}
