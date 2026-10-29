
import InterviewHeader from "@/features/interview/components/interview-header"
import StartMockInterview from "@/features/interview/components/start-mock-interview"
import PerformanceOverview from "@/features/interview/components/performance-overview"

export default function Interview() {
    return (
        <main className="flex min-h-[calc(100vh-4rem)] flex-col bg-background p-10 gap-5">
            <InterviewHeader />
            <div className="flex flex-3 justify-around gap-8">
                <div className="flex-2">
                    <StartMockInterview />
                </div>
                <div className="flex-1">
                    <PerformanceOverview />
                </div>
            </div>
        </main>
    )
}