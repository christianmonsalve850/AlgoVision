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
    <div className="my-6 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 shadow-sm">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/80 px-4 py-2.5">
        <div className="flex items-center gap-2 text-neutral-300">
          <Sliders className="h-4 w-4 text-neutral-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
            Execution Visualizer — Two Sum II
          </span>
        </div>
        <span className="font-mono text-xs text-neutral-400">
          Target: <span className="font-semibold text-neutral-200">{target}</span>
        </span>
      </div>

      {/* Main Visual Area */}
      <div className="p-6">
        {/* Array & Pointer Visualization */}
        <div className="mb-8 flex flex-col items-center justify-center">
          <div className="flex items-center gap-3">
            {numbers.map((num, idx) => {
              const isLeft = idx === stepData.left;
              const isRight = idx === stepData.right;
              const isSelected = isLeft || isRight;

              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  {/* Pointer Top Labels */}
                  <div className="h-6 text-xs font-mono font-bold text-neutral-400">
                    {isLeft && isRight
                      ? 'L & R'
                      : isLeft
                      ? 'Left'
                      : isRight
                      ? 'Right'
                      : ''}
                  </div>

                  {/* Array Cell */}
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl border font-mono text-lg font-semibold transition-all duration-300 ${
                      isSelected
                        ? stepData.found
                          ? 'border-neutral-500 bg-neutral-800 text-neutral-100 shadow-md ring-2 ring-neutral-600'
                          : 'border-neutral-600 bg-neutral-800/90 text-neutral-100'
                        : 'border-neutral-800 bg-neutral-900/50 text-neutral-500'
                    }`}
                  >
                    {num}
                  </div>

                  {/* Index Number */}
                  <span className="font-mono text-[11px] text-neutral-600">
                    [{idx}]
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* State Summary Cards */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-3 text-center">
            <span className="block text-[11px] uppercase tracking-wider text-neutral-500">
              Left Value
            </span>
            <span className="font-mono text-base font-semibold text-neutral-200">
              numbers[{stepData.left}] = {numbers[stepData.left]}
            </span>
          </div>

          <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-3 text-center">
            <span className="block text-[11px] uppercase tracking-wider text-neutral-500">
              Right Value
            </span>
            <span className="font-mono text-base font-semibold text-neutral-200">
              numbers[{stepData.right}] = {numbers[stepData.right]}
            </span>
          </div>

          <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-3 text-center">
            <span className="block text-[11px] uppercase tracking-wider text-neutral-500">
              Current Sum
            </span>
            <span className="font-mono text-base font-semibold text-neutral-100">
              {numbers[stepData.left]} + {numbers[stepData.right]} = {stepData.sum}
            </span>
          </div>
        </div>

        {/* Current Action / Insight Box */}
        <div className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900/60 p-3.5 text-sm text-neutral-300">
          {stepData.found && (
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-neutral-300" />
          )}
          <span className="leading-relaxed">{stepData.action}</span>
        </div>
      </div>

      {/* Control Footer */}
      <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-900/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200 transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-200 hover:border-neutral-700 transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 ml-0.5" />
            )}
          </button>
        </div>

        {/* Step Indicator */}
        <span className="font-mono text-xs text-neutral-500">
          Step {currentStep + 1} of {steps.length}
        </span>

        {/* Step Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-neutral-700 transition-colors"
          >
            <SkipBack className="h-3.5 w-3.5" />
            <span>Prev</span>
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-neutral-700 transition-colors"
          >
            <span>Next</span>
            <SkipForward className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecutionPlayerTwoSumII;