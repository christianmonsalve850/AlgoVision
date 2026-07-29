import React from 'react';
import { Lightbulb } from 'lucide-react';

interface HintProps {
  children: React.ReactNode;
  title?: string;
}

export const Hint: React.FC<HintProps> = ({
  children,
  title = 'Pro Tip',
}) => {
  return (
    <div className="my-5 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-900 shadow-sm">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-700">
        <Lightbulb className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <span className="block text-xs font-semibold uppercase tracking-wider text-amber-700">
          {title}
        </span>
        <div className="mt-1 leading-relaxed [&>p]:m-0">{children}</div>
      </div>
    </div>
  );
};

export default Hint;