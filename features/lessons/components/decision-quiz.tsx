import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, ArrowRight } from 'lucide-react';

interface DecisionQuizProps {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
  title?: string;
}

export const DecisionQuiz: React.FC<DecisionQuizProps> = ({
  question,
  options = [],
  answer,
  explanation,
  title = 'Decision Check',
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    if (selectedIndex === null) {
      setSelectedIndex(index);
    }
  };

  const handleReset = () => {
    setSelectedIndex(null);
  };

  return (
    <div className="lesson-surface my-6 p-5">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2.5 text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <HelpCircle className="h-4 w-4" />
          </div>
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        </div>
        {selectedIndex !== null && (
          <button onClick={handleReset} className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>

      <p className="mb-4 text-sm font-medium text-foreground">{question}</p>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isCorrect = index === answer;
          const showResults = selectedIndex !== null;

          let btnStyles = 'border-border bg-background text-foreground hover:border-primary/20 hover:bg-muted';
          let IconComponent = <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />;

          if (showResults) {
            if (isCorrect) {
              btnStyles = 'border-emerald-500/25 bg-emerald-500/10 text-emerald-800 font-medium';
              IconComponent = <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />;
            } else if (isSelected) {
              btnStyles = 'border-destructive/20 bg-destructive/10 text-destructive line-through';
              IconComponent = <XCircle className="h-4 w-4 shrink-0 text-destructive" />;
            } else {
              btnStyles = 'border-border bg-muted text-muted-foreground opacity-60';
            }
          }

          return (
            <button key={index} disabled={showResults} onClick={() => handleSelect(index)} className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-all ${btnStyles}`}>
              <span>{option}</span>
              {IconComponent}
            </button>
          );
        })}
      </div>

      {selectedIndex !== null && explanation && (
        <div className="mt-4 rounded-lg border border-border bg-muted/80 p-3.5 text-xs leading-relaxed text-foreground/80">
          <span className="font-semibold text-foreground">Explanation: </span>
          {explanation}
        </div>
      )}
    </div>
  );
};

export default DecisionQuiz;