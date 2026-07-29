import React from 'react';
import { Target, CheckCircle2 } from 'lucide-react';

interface LearningObjectivesProps {
  objectives?: string[];
  title?: string;
}

export const LearningObjectives: React.FC<LearningObjectivesProps> = ({ objectives, title }) => {
  return (
    <div className="lesson-surface my-6 p-5">
      <div className="mb-4 flex items-center gap-2.5 text-foreground">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Target className="h-4 w-4" />
        </div>
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      </div>

      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {objectives?.map((objective, index) => (
          <li key={index} className="flex items-start gap-2.5 text-sm text-foreground/80">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{objective}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LearningObjectives;