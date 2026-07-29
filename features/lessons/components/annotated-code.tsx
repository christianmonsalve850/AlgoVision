import React from 'react';
import InteractiveCodeMirror from './interactive-code-mirror';

interface AnnotatedCodeProps {
  language?: string;
  title?: string;
  code: string;
  // Key is 1-based line number
  annotations?: Record<number, string>;
}

export const AnnotatedCode: React.FC<AnnotatedCodeProps> = ({
  language = 'python',
  title = 'Code Implementation',
  code,
  annotations = {},
}) => {
  const lines = code.trim().split('\n');
  const annotationList: string[] = lines.map(
    (_, index) => annotations[index + 1] || ''
  );

  return (
    <InteractiveCodeMirror
      code={code}
      annotations={annotationList}
      title={title}
      language={language}
    />
  );
};

export default AnnotatedCode;