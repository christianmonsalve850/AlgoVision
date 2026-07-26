'use client'

import twoPointersSteps from '@/content/lessons/two-pointers';

type LessonMdxStepsProps = {
  slug: string;
};

export default function LessonMdxSteps({ slug }: LessonMdxStepsProps) {
  const normalizedSlug = slug.replace(/_/g, '-');

  const steps = normalizedSlug === 'two-pointers' ? twoPointersSteps : [];

  if (steps.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      {steps.map((StepComponent, index) => (
        <section key={index} id={`step-${index + 1}`} className="prose prose-invert max-w-none">
          <StepComponent />
        </section>
      ))}
    </div>
  );
}
