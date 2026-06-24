import { TestCaseItem } from "../types";

export const testCases: TestCaseItem[] = [
  { id: 1, 
    input: "nums = [2,7,11,15], target = 9", 
    expected: "[0,1]", 
    status: "passed" 
  },
  { id: 2, 
    input: "nums = [3,2,4], target = 6", 
    expected: "[1,2]", 
    status: "failed" 
  },
  { id: 3, 
    input: "nums = [1,5,1,5], target = 10", 
    expected: "[1,3]", 
    status: "idle" 
  },
];
