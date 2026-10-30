import { Progress } from "@/components/ui/progress";

export default function ScoreDistribution() {
  return (
    <div className="flex flex-col border border-border w-full rounded-lg p-6 gap-6">
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        Score Distribution
      </h2>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Passed</span>
          <span className="text-muted-foreground font-semibold">3</span>
        </div>
        <Progress value={60} color="bg-emerald-600 dark:bg-emerald-500" />
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <span className="text-amber-700 dark:text-amber-400 font-semibold">Partial</span>
          <span className="text-muted-foreground font-semibold">1</span>
        </div>
        <Progress value={20} color="bg-amber-600 dark:bg-amber-500" />
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <span className="text-red-700 dark:text-red-400 font-semibold">Failed</span>
          <span className="text-muted-foreground font-semibold">1</span>
        </div>
        <Progress value={20} color="bg-red-600 dark:bg-red-500" />
      </div>
    </div>
  );
}
