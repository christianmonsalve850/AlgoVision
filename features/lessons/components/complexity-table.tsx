import React from 'react';
import { Gauge } from 'lucide-react';

export interface ComplexityMetrics {
  time: string;
  space: string;
}

interface ComplexityTableProps {
  before?: ComplexityMetrics;
  after?: ComplexityMetrics;
  title?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const ComplexityTable: React.FC<ComplexityTableProps> = ({
  before = { time: 'O(n²)', space: 'O(1)' },
  after = { time: 'O(n)', space: 'O(1)' },
  title = 'Complexity Comparison',
  beforeLabel = 'Brute Force',
  afterLabel = 'Two Pointers',
}) => {
  return (
    <div className="lesson-surface my-6 p-5">
      <div className="mb-4 flex items-center gap-2.5 text-foreground">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Gauge className="h-4 w-4" />
        </div>
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="lesson-surface-muted p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {beforeLabel}
          </span>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Time:</span>
              <span className="font-mono text-foreground">{before.time}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Space:</span>
              <span className="font-mono text-foreground">{before.space}</span>
            </div>
          </div>
        </div>

        <div className="lesson-surface-muted p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {afterLabel}
          </span>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Time:</span>
              <span className="font-mono text-foreground">{after.time}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Space:</span>
              <span className="font-mono text-foreground">{after.space}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplexityTable;