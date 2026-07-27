'use client'

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import twoPointersSteps from '@/content/lessons/two-pointers';

type LessonMdxStepsProps = {
  slug: string;
  step?: string;
};

function getStepNumber(step?: string) {
  if (!step) {
    return 1;
  }

  const match = step.match(/step[_-]?(\d+)/i);
  return match ? Number(match[1]) : 1;
}

export default function LessonMdxSteps({ slug, step }: LessonMdxStepsProps) {
  const normalizedSlug = slug.replace(/_/g, '-');
  const steps = normalizedSlug === 'two-pointers' ? twoPointersSteps : [];

  if (steps.length === 0) {
    return null;
  }

  const currentStepNumber = Math.min(Math.max(getStepNumber(step), 1), steps.length);
  const CurrentStep = steps[currentStepNumber - 1];

  if (!CurrentStep) {
    return null;
  }

  const previousHref = currentStepNumber > 1 ? `/learn/${slug}/step_${currentStepNumber - 1}` : null;
  const nextHref = currentStepNumber < steps.length ? `/learn/${slug}/step_${currentStepNumber + 1}` : null;

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between gap-4 rounded-xl border border-neutral-800/80 bg-neutral-900/40 px-3 py-2">
        <div className="flex flex-1 items-center">
          {previousHref ? (
            <Link
              href={previousHref}
              className="inline-flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-neutral-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          ) : null}
        </div>

        <div className="text-sm font-medium text-neutral-500">
          Step {currentStepNumber} of {steps.length}
        </div>

        <div className="flex flex-1 justify-end">
          {nextHref ? (
            <Link
              href={nextHref}
              className="inline-flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-neutral-200"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      </div>

      <section id={`step-${currentStepNumber}`} className="prose prose-invert max-w-none">
        <CurrentStep />
      </section>
    </div>
  );
}
