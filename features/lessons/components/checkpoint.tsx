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
    <div className="lesson-surface my-6 p-5">
      <div className="mb-3 flex items-center gap-2 text-foreground">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <HelpCircle className="h-4 w-4" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
      </div>

      <div className="text-sm italic leading-relaxed text-foreground/80 [&>p]:m-0">
        {children}
      </div>
    </div>
  );
};

export default Checkpoint;