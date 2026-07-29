import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SummaryProps {
  children: React.ReactNode;
  title?: string;
}

export const Summary: React.FC<SummaryProps> = ({
  children,
  title = 'Key Takeaways',
}) => {
  return (
    <div className="lesson-surface my-6 p-5">
      <div className="mb-4 flex items-center gap-2.5 border-b border-border pb-3 text-foreground">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <CheckCircle2 className="h-4 w-4" />
        </div>
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      </div>

      <div className="space-y-2.5 text-sm leading-relaxed text-foreground/80 [&_ul]:m-0 [&_ul]:p-0 [&_ul]:list-none [&_ul]:space-y-2 font-medium [&_li]:flex [&_li]:items-start [&_li]:gap-2.5 [&_li::before]:mt-1.5 [&_li::before]:h-1.5 [&_li::before]:w-1.5 [&_li::before]:shrink-0 [&_li::before]:rounded-full [&_li::before]:bg-primary">
        {children}
      </div>
    </div>
  );
};

export default Summary;