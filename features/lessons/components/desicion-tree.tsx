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
    <div className="lesson-surface my-6 p-5">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2.5 text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <GitFork className="h-4 w-4" />
          </div>
          <h3 className="text-base font-semibold tracking-tight">Pattern Decision Tree</h3>
        </div>
        {(currentStepId > 1 || selectedResult) && (
          <button onClick={handleReset} className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
            <RotateCcw className="h-3.5 w-3.5" />
            Restart
          </button>
        )}
      </div>

      {selectedResult ? (
        <div className="lesson-surface-muted p-4 text-center">
          <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-primary" />
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Recommendation</p>
          <p className="mt-1 text-base font-medium text-foreground">{selectedResult}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-2.5 text-sm text-foreground/80">
            <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="font-medium">{currentStep.question}</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <button onClick={() => handleSelect(currentStep.yesOption.nextStepId, currentStep.yesOption.result)} className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-left text-sm text-foreground transition-all hover:border-primary/20 hover:bg-muted">
              <span>{currentStep.yesOption.label}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </button>

            <button onClick={() => handleSelect(currentStep.noOption.nextStepId, currentStep.noOption.result)} className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-left text-sm text-foreground transition-all hover:border-primary/20 hover:bg-muted">
              <span>{currentStep.noOption.label}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecisionTree;