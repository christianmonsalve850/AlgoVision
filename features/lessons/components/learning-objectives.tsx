import React from 'react';
import { Target, CheckCircle2 } from 'lucide-react';

interface LearningObjectivesProps {
  /**
   * Optional custom list of objectives. 
   * If omitted, you can pass objectives directly via props or context.
   */
  objectives?: string[];
  title?: string;
}

export  const LearningObjectives: React.FC<LearningObjectivesProps> = ({ objectives, title
}) => {
  return (
    <div className="my-6 rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2.5 text-neutral-200">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300">
          <Target className="h-4 w-4" />
        </div>
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      </div>

      {/* List */}
      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {objectives?.map((objective, index) => (
          <li
            key={index}
            className="flex items-start gap-2.5 text-sm text-neutral-300"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-400" />
            <span>{objective}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LearningObjectives;