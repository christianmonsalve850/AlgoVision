

export type CallFrameProps = {
    name: string;
    // args: Record<string, any>;
    args: string;
    isActive?: boolean;
};

export type ExecutionStep = {
  stepNumber: number;
  line: number;
  functionName: string; // e.g., "floodFill" or "class Solution"
  expression: string;   // e.g., "class Solution:" or "if not image:"
  variables: Record<string, any>;
};

export type ExecutionTraceProps = {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  children: React.ReactNode; // Instantiates the stacks, loops, and VariableState collections
};

export type ExecutionTrace = {
  steps: ExecutionStep[];
}