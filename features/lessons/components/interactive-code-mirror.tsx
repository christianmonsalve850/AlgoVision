import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';
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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof document === 'undefined') {
      return false;
    }

    return document.documentElement.classList.contains('dark');
  });

  const lines = value.split('\n');
  const currentAnnotation = annotations[activeLine - 1];

  useEffect(() => {
    const root = document.documentElement;

    const observer = new MutationObserver(() => {
      setIsDarkMode(root.classList.contains('dark'));
    });

    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const cursorListener = EditorView.updateListener.of((update) => {
    if (update.selectionSet || update.docChanged) {
      const pos = update.state.selection.main.head;
      const line = update.state.doc.lineAt(pos).number;
      setActiveLine(line);
    }
  });

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border bg-muted/70 px-4 py-2.5">
        <div className="flex items-center gap-2 text-foreground/80">
          <Terminal className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">{title}</span>
          <span className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden rounded bg-background px-2 py-0.5 text-[10px] font-mono text-muted-foreground sm:inline-block">
            Line {activeLine} of {lines.length}
          </span>

          <button onClick={handleCopy} className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground" title="Copy code">
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
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

      <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
        <div className="text-sm font-mono md:col-span-2 [&_.cm-editor]:bg-transparent [&_.cm-gutters]:border-r-border [&_.cm-gutters]:bg-background">
          <CodeMirror value={value} height={height} extensions={[python(), cursorListener]} theme={isDarkMode ? vscodeDark : vscodeLight} onChange={(val) => setValue(val)} />
        </div>

        <div className="flex flex-col justify-between bg-muted/50 p-4 md:col-span-1">
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Info className="h-3.5 w-3.5" />
              <span>Line Annotation</span>
            </div>
            {currentAnnotation ? (
              <p className="rounded-lg border border-border bg-background p-3 text-sm font-medium leading-relaxed text-foreground">
                {currentAnnotation}
              </p>
            ) : (
              <p className="p-2 text-xs italic text-muted-foreground">Click or move cursor to any line to view its explanation.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveCodeMirror;