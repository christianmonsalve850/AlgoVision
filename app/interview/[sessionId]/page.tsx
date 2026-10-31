import AssessmentSession from "@/features/interview/assessment/components/AssessmentSession";

type InterviewSessionProps = {
  params: Promise<{ sessionId: string }>;
};

export default async function InterviewSessionPage({ params }: InterviewSessionProps) {
  const { sessionId } = await params;

  return <AssessmentSession sessionId={sessionId} />;
}
