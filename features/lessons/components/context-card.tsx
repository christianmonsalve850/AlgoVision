import React from 'react';
import { HelpCircle, Zap } from 'lucide-react';

export interface ContextCardProps {
  title?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  subtitle?: string;
  description: React.ReactNode;
  example?: {
    input: string;
    output: string;
    note?: string;
  };
  keyDifference?: string;
}

export const ContextCard: React.FC<ContextCardProps> = ({
  title,
  difficulty,
  subtitle,
  description,
  example,
  keyDifference,
}) => {
  // Difficulty tag badge styling
  const getDifficultyColor = (diff?: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Hard':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-neutral-800 text-neutral-400 border-neutral-700/50';
    }
  };

  return (
    <div className="my-6 rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-sm">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-emerald-400" />
          <h2 className="text-base font-bold text-white">{title}</h2>
          {difficulty && (
            <span
              className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${getDifficultyColor(
                difficulty
              )}`}
            >
              {difficulty}
            </span>
          )}
        </div>
        {subtitle && (
          <span className="font-mono text-xs text-neutral-400">{subtitle}</span>
        )}
      </div>

      {/* Description */}
      <div className="mt-3 text-sm leading-relaxed text-neutral-300">
        {description}
      </div>

      {/* Code / Input-Output Example (Optional) */}
      {example && (
        <div className="mt-4 rounded-lg border border-neutral-800/80 bg-neutral-950/80 p-3.5 font-mono text-xs text-neutral-300">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-neutral-500 select-none">Input:</span>
            <span className="text-neutral-200">{example.input}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className="text-neutral-500 select-none">Output:</span>
            <span className="text-emerald-400 font-semibold">{example.output}</span>
            {example.note && (
              <span className="font-sans italic text-neutral-500 sm:ml-2">
                ({example.note})
              </span>
            )}
          </div>
        </div>
      )}

      {/* Key Insight / Difference Callout (Optional) */}
      {keyDifference && (
        <div className="mt-3.5 flex items-start gap-2 rounded-lg bg-neutral-950/40 p-2.5 text-xs text-neutral-400 border border-neutral-800/50">
          <Zap className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
          <span>{keyDifference}</span>
        </div>
      )}
    </div>
  );
};

export default ContextCard;