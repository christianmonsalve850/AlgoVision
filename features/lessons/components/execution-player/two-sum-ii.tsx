import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface StepState {
  left: number;
  right: number;
  sum: number;
  action: string;
  found: boolean;
  highlightedLine: number;
}

const numbers = [2, 7, 11, 15];
const target = 9;

const steps: StepState[] = [
  {
    left: 0,
    right: 3,
    sum: 17,
    action: 'Sum (17) > Target (9). Decrement right pointer (right -= 1).',
    found: false,
    highlightedLine: 13,
  },
  {
    left: 0,
    right: 2,
    sum: 13,
    action: 'Sum (13) > Target (9). Decrement right pointer (right -= 1).',
    found: false,
    highlightedLine: 13,
  },
  {
    left: 0,
    right: 1,
    sum: 9,
    action: 'Sum (9) == Target (9). Found solution! Return 1-based indices [1, 2].',
    found: true,
    highlightedLine: 8,
  },
];

export const ExecutionPlayerTwoSumII: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const stepData = steps[currentStep];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border bg-muted/70 px-4 py-2.5">
        <div className="flex items-center gap-2 text-foreground/80">
          <Sliders className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Execution Visualizer — Two Sum II
          </span>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          Target: <span className="font-semibold text-foreground">{target}</span>
        </span>
      </div>

      <div className="p-6">
        <div className="mb-8 flex flex-col items-center justify-center">
          <div className="flex items-center gap-3">
            {numbers.map((num, idx) => {
              const isLeft = idx === stepData.left;
              const isRight = idx === stepData.right;
              const isSelected = isLeft || isRight;

              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="h-6 text-xs font-mono font-bold text-muted-foreground">
                    {isLeft && isRight ? 'L & R' : isLeft ? 'Left' : isRight ? 'Right' : ''}
                  </div>

                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl border font-mono text-lg font-semibold transition-all duration-300 ${
                    isSelected
                      ? stepData.found
                        ? 'border-primary bg-primary/15 text-foreground shadow-md ring-2 ring-primary/20'
                        : 'border-primary/40 bg-primary/10 text-foreground'
                      : 'border-border bg-background text-muted-foreground'
                  }`}>
                    {num}
                  </div>

                  <span className="font-mono text-[11px] text-muted-foreground">[{idx}]</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="lesson-surface-muted p-3 text-center">
            <span className="block text-[11px] uppercase tracking-wider text-muted-foreground">Left Value</span>
            <span className="font-mono text-base font-semibold text-foreground">numbers[{stepData.left}] = {numbers[stepData.left]}</span>
          </div>

          <div className="lesson-surface-muted p-3 text-center">
            <span className="block text-[11px] uppercase tracking-wider text-muted-foreground">Right Value</span>
            <span className="font-mono text-base font-semibold text-foreground">numbers[{stepData.right}] = {numbers[stepData.right]}</span>
          </div>

          <div className="lesson-surface-muted p-3 text-center">
            <span className="block text-[11px] uppercase tracking-wider text-muted-foreground">Current Sum</span>
            <span className="font-mono text-base font-semibold text-foreground">{numbers[stepData.left]} + {numbers[stepData.right]} = {stepData.sum}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-border bg-background/80 p-3.5 text-sm text-foreground/80">
          {stepData.found && <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />}
          <span className="leading-relaxed">{stepData.action}</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border bg-muted/70 px-4 py-3">
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary/20 hover:text-foreground" title="Reset">
            <RotateCcw className="h-4 w-4" />
          </button>
          <button onClick={() => setIsPlaying(!isPlaying)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:border-primary/20" title={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>
        </div>

        <span className="font-mono text-xs text-muted-foreground">Step {currentStep + 1} of {steps.length}</span>

        <div className="flex items-center gap-2">
          <button onClick={handlePrev} disabled={currentStep === 0} className="flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary/20 transition-colors">
            <SkipBack className="h-3.5 w-3.5" />
            <span>Prev</span>
          </button>
          <button onClick={handleNext} disabled={currentStep === steps.length - 1} className="flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary/20 transition-colors">
            <span>Next</span>
            <SkipForward className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecutionPlayerTwoSumII;