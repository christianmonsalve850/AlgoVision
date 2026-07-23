import ContinueLearning from "@/features/learn/components/continue-learning";
import LearnHeader from "@/features/learn/components/learn-header";

export default function Learn() {

  return ( 
    <main className="flex min-h-[calc(100vh-4rem)] flex-col bg-background p-6">
        <LearnHeader />
        <ContinueLearning />
    </main>
  );
}
