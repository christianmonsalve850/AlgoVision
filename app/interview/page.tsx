
import InterviewHeader from "@/features/interview/components/interview-header"
import StartMockInterview from "@/features/interview/components/start-mock-interview"
import PerformanceOverview from "@/features/interview/components/performance-overview"
import ScoreDistribution from "@/features/interview/components/score-distribution"
import InterviewTips from "@/features/interview/components/interview-tips"
import RecentSessions from "@/features/interview/components/recent-sessions"
import { Session, Difficulty, Duration, InterviewResult } from "@/features/interview/types"

export const mockSessions: Session[] = [
    {
        difficulty: "Medium" as Difficulty, // Or use your actual enum/type values
        duration: 30 as Duration,
        date: new Date("2026-10-28"),
        problemsSolved: 2,
        score: 85,
        result: "Passed" as InterviewResult,
    },
    {
        difficulty: "Hard" as Difficulty,
        duration: 60 as Duration,
        date: new Date("2026-10-26"),
        problemsSolved: 2,
        score: 70,
        result: "Passed" as InterviewResult,
    },
    {
        difficulty: "Easy" as Difficulty,
        duration: 15 as Duration,
        date: new Date("2026-10-24"),
        problemsSolved: 2,
        score: 100,
        result: "Partial" as InterviewResult,
    },
    {
        difficulty: "Medium" as Difficulty,
        duration: 45 as Duration,
        date: new Date("2026-10-22"),
        problemsSolved: 2,
        score: 40,
        result: "Failed" as InterviewResult,
    },
];

export default function Interview() {
    return (
        <main className="flex min-h-[calc(100vh-4rem)] flex-col bg-background p-10 gap-5">
            <InterviewHeader />
            <div className="flex flex-3 justify-around gap-8">
                <div className="flex flex-col gap-8 flex-2">
                    <StartMockInterview />
                    <RecentSessions sessions={mockSessions} />
                </div>
                <div className="flex flex-col gap-8 flex-1">
                    <PerformanceOverview />
                    <ScoreDistribution />
                    <InterviewTips />
                </div>
            </div>
        </main>
    )
}