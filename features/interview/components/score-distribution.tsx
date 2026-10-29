import { Progress } from "@/components/ui/progress";

export default function ScoreDistribution() {
  return (
    <div className="flex flex-col border border-border w-full rounded-lg p-6 gap-6">
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        Score Distribution
      </h2>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <span className="text-emerald-500 font-semibold">Passed</span>
          <span className="text-muted-foreground font-semibold">3</span>
        </div>
        <Progress value={60} color="bg-emerald-500" />
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <span className="text-orange-600 font-semibold">Partial</span>
          <span className="text-muted-foreground font-semibold">1</span>
        </div>
        <Progress value={20} color="bg-orange-600" />
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <span className="text-yellow-500 font-semibold">Failed</span>
          <span className="text-muted-foreground font-semibold">1</span>
        </div>
        <Progress value={20} color="bg-yellow-500" />
      </div>
    </div>
  );
}
