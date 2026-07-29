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
    <div className="lesson-surface my-4 p-4 transition-all hover:border-primary/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-foreground">{title}</h4>
              <span className="rounded border border-border bg-background px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground">
                {difficulty}
              </span>
            </div>
            {description && (
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
            )}
          </div>
        </div>

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
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