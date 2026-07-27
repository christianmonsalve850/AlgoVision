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
    <div className="my-6 rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2.5 text-neutral-200">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300">
          <Radio className="h-4 w-4" />
        </div>
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      </div>

      {/* Signals List */}
      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {signals.map((signal, index) => (
          <li
            key={index}
            className="flex items-center gap-2.5 rounded-lg border border-neutral-800/80 bg-neutral-950/40 px-3 py-2.5 text-sm text-neutral-300 transition-colors hover:border-neutral-700"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-neutral-400" />
            <span>{signal}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatternSignals;