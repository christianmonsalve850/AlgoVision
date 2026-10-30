import { RecentSessionProps } from "@/features/interview/types";
import SessionItem from "@/features/interview/components/session-item";

export default function RecentSessions({ sessions }: RecentSessionProps) {
  return (
    <div className="border border-border p-6 rounded-lg">
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Recent Sessions
        </h2>
        <div className="flex flex-col gap-3">
          {sessions.map((session, index) => (
            <SessionItem
              key={index}
              difficulty={session.difficulty}
              duration={session.duration}
              date={session.date}
              problemsSolved={session.problemsSolved}
              score={session.score}
              result={session.result}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
