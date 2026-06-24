import type { Language } from "../types";

export const languageOptions: { label: Language; value: Language; fileName: string; extension: string }[] =
  [
    { label: "Python", 
      value: "Python", 
      fileName: "solution.py", 
      extension: "python" 
    },
    { label: "JavaScript", 
      value: "JavaScript", 
      fileName: "solution.js", 
      extension: "javascript" 
    },
    { label: "Java", 
      value: "Java", 
      fileName: "Solution.java", 
      extension: "java" 
    },
  ];

  