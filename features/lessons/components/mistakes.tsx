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
    <div className="my-5 flex items-start gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 text-sm text-neutral-300 shadow-sm">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-800 text-neutral-400">
        <AlertCircle className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {title}
        </span>
        <div className="mt-1 leading-relaxed [&>p]:m-0">{children}</div>
      </div>
    </div>
  );
};

export default Mistake;