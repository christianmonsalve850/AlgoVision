import React, { useState } from 'react';
import { GitFork, ArrowRight, RotateCcw, CheckCircle2, HelpCircle } from 'lucide-react';

interface DecisionStep {
  question: string;
  yesOption: { label: string; nextStepId?: number; result?: string };
  noOption: { label: string; nextStepId?: number; result?: string };
}

type DecisionTreeProps = {
    decisionSteps: Record<number, DecisionStep>,
}

export const DecisionTree: React.FC<DecisionTreeProps> = ({ decisionSteps }) => {
  const [currentStepId, setCurrentStepId] = useState<number>(1);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);

  const handleSelect = (nextStepId?: number, result?: string) => {
    if (result) {
      setSelectedResult(result);
    } else if (nextStepId) {
      setCurrentStepId(nextStepId);
    }
  };

  const handleReset = () => {
    setCurrentStepId(1);
    setSelectedResult(null);
  };

  const currentStep = decisionSteps[currentStepId];

  return (
    <div className="my-6 rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2.5 text-neutral-200">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300">
            <GitFork className="h-4 w-4" />
          </div>
          <h3 className="text-base font-semibold tracking-tight">Pattern Decision Tree</h3>
        </div>
        {(currentStepId > 1 || selectedResult) && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restart
          </button>
        )}
      </div>

      {/* Decision Card Body */}
      {selectedResult ? (
        <div className="rounded-lg border border-neutral-700/60 bg-neutral-950/60 p-4 text-center">
          <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-neutral-300" />
          <p className="text-xs uppercase tracking-wider text-neutral-400">Recommendation</p>
          <p className="mt-1 text-base font-medium text-neutral-100">{selectedResult}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-2.5 text-sm text-neutral-200">
            <HelpCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-400" />
            <span className="font-medium">{currentStep.question}</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <button
              onClick={() => handleSelect(currentStep.yesOption.nextStepId, currentStep.yesOption.result)}
              className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950/40 px-4 py-3 text-left text-sm text-neutral-300 transition-all hover:border-neutral-700 hover:bg-neutral-800/50"
            >
              <span>{currentStep.yesOption.label}</span>
              <ArrowRight className="h-4 w-4 text-neutral-500" />
            </button>

            <button
              onClick={() => handleSelect(currentStep.noOption.nextStepId, currentStep.noOption.result)}
              className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950/40 px-4 py-3 text-left text-sm text-neutral-300 transition-all hover:border-neutral-700 hover:bg-neutral-800/50"
            >
              <span>{currentStep.noOption.label}</span>
              <ArrowRight className="h-4 w-4 text-neutral-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecisionTree;