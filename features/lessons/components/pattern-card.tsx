import React from 'react';
import { Layers, ChevronRight } from 'lucide-react';

interface PatternCardProps {
  title?: string;
  items: string[];
}

export const PatternCard: React.FC<PatternCardProps> = ({
  title = "Where You'll See It",
  items = [],
}) => {
  return (
    <div className="my-6 rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2.5 text-neutral-200">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300">
          <Layers className="h-4 w-4" />
        </div>
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      </div>

      {/* Items Grid */}
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-center gap-2 rounded-lg border border-neutral-800/80 bg-neutral-950/40 px-3 py-2 text-sm text-neutral-300 transition-colors hover:border-neutral-700"
          >
            <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-neutral-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatternCard;