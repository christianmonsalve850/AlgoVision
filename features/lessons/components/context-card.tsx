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
  const getDifficultyColor = (diff?: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
      case 'Hard':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="lesson-surface my-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold text-foreground">{title}</h2>
          {difficulty && (
            <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </span>
          )}
        </div>
        {subtitle && <span className="font-mono text-xs text-muted-foreground">{subtitle}</span>}
      </div>

      <div className="mt-3 text-sm leading-relaxed text-foreground/80">{description}</div>

      {example && (
        <div className="lesson-surface-muted mt-4 p-3.5 font-mono text-xs text-foreground">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="select-none text-muted-foreground">Input:</span>
            <span>{example.input}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className="select-none text-muted-foreground">Output:</span>
            <span className="font-semibold text-primary">{example.output}</span>
            {example.note && <span className="font-sans italic text-muted-foreground sm:ml-2">({example.note})</span>}
          </div>
        </div>
      )}

      {keyDifference && (
        <div className="lesson-surface-muted mt-3.5 flex items-start gap-2 p-2.5 text-xs text-muted-foreground">
          <Zap className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>{keyDifference}</span>
        </div>
      )}
    </div>
  );
};

export default ContextCard;