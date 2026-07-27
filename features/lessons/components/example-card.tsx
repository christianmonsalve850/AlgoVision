import React from 'react';
import { BookOpen, ArrowUpRight } from 'lucide-react';

interface ExampleCardProps {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description?: string;
  link?: string;
}

export const ExampleCard: React.FC<ExampleCardProps> = ({
  title,
  difficulty,
  description,
  link,
}) => {
  return (
    <div className="my-4 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 transition-all hover:border-neutral-700 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-neutral-100">{title}</h4>
              <span className="rounded bg-neutral-800/80 px-2 py-0.5 font-mono text-[11px] font-medium text-neutral-300 border border-neutral-700/50">
                {difficulty}
              </span>
            </div>
            {description && (
              <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <span>View</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

export default ExampleCard;