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
    <div className="my-6 rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2.5 text-neutral-200">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300">
            <HelpCircle className="h-4 w-4" />
          </div>
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        </div>
        {selectedIndex !== null && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Question Prompt */}
      <p className="mb-4 text-sm font-medium text-neutral-200">{question}</p>

      {/* Options Grid */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isCorrect = index === answer;
          const showResults = selectedIndex !== null;

          let btnStyles =
            'border-neutral-800 bg-neutral-950/40 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800/40';
          let IconComponent = <ArrowRight className="h-4 w-4 text-neutral-500 flex-shrink-0" />;

          if (showResults) {
            if (isCorrect) {
              btnStyles =
                'border-neutral-600 bg-neutral-800/90 text-neutral-100 font-medium';
              IconComponent = <CheckCircle2 className="h-4 w-4 text-neutral-300 flex-shrink-0" />;
            } else if (isSelected) {
              btnStyles =
                'border-neutral-700 bg-neutral-900 text-neutral-400 line-through';
              IconComponent = <XCircle className="h-4 w-4 text-neutral-500 flex-shrink-0" />;
            } else {
              btnStyles = 'border-neutral-800/50 bg-neutral-950/20 text-neutral-500 opacity-50';
            }
          }

          return (
            <button
              key={index}
              disabled={showResults}
              onClick={() => handleSelect(index)}
              className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-all ${btnStyles}`}
            >
              <span>{option}</span>
              {IconComponent}
            </button>
          );
        })}
      </div>

      {/* Explanation Box */}
      {selectedIndex !== null && explanation && (
        <div className="mt-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-3.5 text-xs text-neutral-300 leading-relaxed">
          <span className="font-semibold text-neutral-200">Explanation: </span>
          {explanation}
        </div>
      )}
    </div>
  );
};

export default DecisionQuiz;