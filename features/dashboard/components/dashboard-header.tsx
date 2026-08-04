export default function DashboardHeader() {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Your Progress
      </h1>
      <p className="text-sm text-muted-foreground">
        Track your algorithm mastery journey
      </p>
    </div>
  );
}