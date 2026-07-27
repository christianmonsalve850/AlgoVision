import React from 'react';
import { Gauge, ArrowRight } from 'lucide-react';

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
    <div className="my-6 rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2.5 text-neutral-200">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300">
          <Gauge className="h-4 w-4" />
        </div>
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      </div>

      {/* Grid Comparison */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Before Card */}
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/40 p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            {beforeLabel}
          </span>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-400">Time:</span>
              <span className="font-mono text-neutral-200">{before.time}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-400">Space:</span>
              <span className="font-mono text-neutral-200">{before.space}</span>
            </div>
          </div>
        </div>

        {/* After Card */}
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/40 p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            {afterLabel}
          </span>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-400">Time:</span>
              <span className="font-mono text-neutral-200">{after.time}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-400">Space:</span>
              <span className="font-mono text-neutral-200">{after.space}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplexityTable;