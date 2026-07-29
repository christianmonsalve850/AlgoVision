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
    <div className="lesson-surface my-6 p-5">
      <div className="mb-4 flex items-center gap-2.5 text-foreground">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Layers className="h-4 w-4" />
        </div>
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      </div>

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground/80 transition-colors hover:border-primary/20">
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatternCard;