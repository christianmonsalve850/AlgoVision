import React from 'react';
import { Target, ExternalLink, CheckCircle } from 'lucide-react';

interface ProblemMeta {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  url: string;
}

const PROBLEM_LOOKUP: Record<string, ProblemMeta> = {
  'Two Sum II': {
    title: 'Two Sum II - Input Array Is Sorted',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
  },
  'Valid Palindrome': {
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    url: 'https://leetcode.com/problems/valid-palindrome/',
  },
  'Container With Most Water': {
    title: 'Container With Most Water',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/container-with-most-water/',
  },
  '3Sum': {
    title: '3Sum',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/3sum/',
  },
  'Remove Duplicates From Sorted Array': {
    title: 'Remove Duplicates from Sorted Array',
    difficulty: 'Easy',
    url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/',
  },
};

interface RecommendedProblemsProps {
  problems?: string[];
  title?: string;
}

export const RecommendedProblems: React.FC<RecommendedProblemsProps> = ({
  problems = [
    'Two Sum II',
    'Valid Palindrome',
    'Container With Most Water',
    '3Sum',
    'Remove Duplicates From Sorted Array',
  ],
  title = 'Recommended Practice Problems',
}) => {
  return (
    <div className="lesson-surface my-6 p-5">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2.5 text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Target className="h-4 w-4" />
          </div>
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        </div>
        <span className="font-mono text-xs text-muted-foreground">{problems.length} Problems</span>
      </div>

      <div className="space-y-2">
        {problems.map((probName, idx) => {
          const problem = PROBLEM_LOOKUP[probName] || {
            title: probName,
            difficulty: 'Easy',
            url: `https://leetcode.com/problemset/all/?search=${encodeURIComponent(probName)}`,
          };

          return (
            <a key={idx} href={problem.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm transition-all hover:border-primary/20 hover:bg-muted">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                <span className="font-medium text-foreground/80 group-hover:text-foreground">{problem.title}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded border border-border bg-background px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground">
                  {problem.difficulty}
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedProblems;