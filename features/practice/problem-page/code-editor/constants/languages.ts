import type { Language } from "@/features/practice/problem-page/code-editor/types";

export const languageOptions: { label: Language; value: Language; fileName: string; extension: string }[] =
  [
    { label: "Python", 
      value: "Python", 
      fileName: "solution.py", 
      extension: "python" 
    },
  ];

  