import React from 'react';
import { AlertCircle } from 'lucide-react';

interface MistakeProps {
  children: React.ReactNode;
  title?: string;
}

export const Mistake: React.FC<MistakeProps> = ({
  children,
  title = 'Common Mistake',
}) => {
  return (
    <div className="my-5 flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive shadow-sm">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/20 text-destructive">
        <AlertCircle className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <span className="block text-xs font-semibold uppercase tracking-wider text-destructive">
          {title}
        </span>
        <div className="mt-1 leading-relaxed [&>p]:m-0">{children}</div>
      </div>
    </div>
  );
};

export default Mistake;