import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { EditorView } from '@codemirror/view';
import { Terminal, Info, Copy, Check } from 'lucide-react';

interface InteractiveCodeMirrorProps {
  code: string;
  annotations?: string[];
  title?: string;
  language?: string;
  height?: string;
}

export const InteractiveCodeMirror: React.FC<InteractiveCodeMirrorProps> = ({
  code,
  annotations = [],
  title = 'Interactive Implementation',
  language = 'python',
  height = '260px',
}) => {
  const [value, setValue] = useState(code.trim());
  const [activeLine, setActiveLine] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  const lines = value.split('\n');
  const currentAnnotation = annotations[activeLine - 1];

  // Copy code handler
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Extension to capture active cursor line in CodeMirror
  const cursorListener = EditorView.updateListener.of((update) => {
    if (update.selectionSet || update.docChanged) {
      const pos = update.state.selection.main.head;
      const line = update.state.doc.lineAt(pos).number;
      setActiveLine(line);
    }
  });

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 shadow-sm">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/80 px-4 py-2.5">
        <div className="flex items-center gap-2 text-neutral-300">
          <Terminal className="h-4 w-4 text-neutral-400" />
          <span className="text-xs font-medium text-neutral-200">{title}</span>
          
          {/* Language Badge */}
          <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400 border border-neutral-700/50">
            {language}
          </span>
        </div>

        {/* Right Action Items */}
        <div className="flex items-center gap-3">
          {/* Line Tracker */}
          <span className="hidden sm:inline-block rounded bg-neutral-800/80 px-2 py-0.5 text-[10px] font-mono text-neutral-400">
            Line {activeLine} of {lines.length}
          </span>

          {/* Copy Code Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-200"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor + Annotation Layout */}
      <div className="grid grid-cols-1 divide-y divide-neutral-800 md:grid-cols-3 md:divide-x md:divide-y-0">
        {/* CodeMirror Column */}
        <div className="text-sm font-mono md:col-span-2 [&_.cm-editor]:bg-transparent [&_.cm-gutters]:border-r-neutral-800 [&_.cm-gutters]:bg-neutral-950">
          <CodeMirror
            value={value}
            height={height}
            extensions={[python(), cursorListener]}
            theme={vscodeDark}
            onChange={(val) => setValue(val)}
          />
        </div>

        {/* Annotation Panel Column */}
        <div className="flex flex-col justify-between bg-neutral-900/40 p-4 md:col-span-1">
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
              <Info className="h-3.5 w-3.5 text-neutral-400" />
              <span>Line Annotation</span>
            </div>
            {currentAnnotation ? (
              <p className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-3 text-sm font-medium leading-relaxed text-neutral-200">
                {currentAnnotation}
              </p>
            ) : (
              <p className="p-2 text-xs italic text-neutral-500">
                Click or move cursor to any line to view its explanation.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveCodeMirror;