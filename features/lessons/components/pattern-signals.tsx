import React from 'react';
import { Radio, Sparkles } from 'lucide-react';

interface PatternSignalsProps {
  signals: string[];
  title?: string;
}

export const PatternSignals: React.FC<PatternSignalsProps> = ({
  signals = [],
  title = 'Common Pattern Signals',
}) => {
  return (
    <div className="lesson-surface my-6 p-5">
      <div className="mb-4 flex items-center gap-2.5 text-foreground">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Radio className="h-4 w-4" />
        </div>
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      </div>

      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {signals.map((signal, index) => (
          <li key={index} className="flex items-center gap-2.5 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:border-primary/20">
            <Sparkles className="h-4 w-4 shrink-0 text-primary" />
            <span>{signal}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatternSignals;