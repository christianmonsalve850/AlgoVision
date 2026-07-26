import React from 'react';
import { HelpCircle } from 'lucide-react';

interface CheckpointProps {
  children: React.ReactNode;
  title?: string;
}

export const Checkpoint: React.FC<CheckpointProps> = ({
  children,
  title = 'Checkpoint',
}) => {
  return (
    <div className="my-6 rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2 text-neutral-200">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-800 text-neutral-400">
          <HelpCircle className="h-4 w-4" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {title}
        </span>
      </div>

      {/* Content */}
      <div className="text-sm italic leading-relaxed text-neutral-300 [&>p]:m-0">
        {children}
      </div>
    </div>
  );
};

export default Checkpoint;