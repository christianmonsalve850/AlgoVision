import { WorkerClient } from "./runtime/worker-client";
import type {
    ExecutionOptions,
  ExecutionOutcome,
  TestCaseExecutionOutcome,
} from "./runtime/types";

export interface TraceTestCase {
  id: string;
  input: Record<string, unknown>;
  is_hidden: boolean;
}

export async function executeTrace(
  userCode: string,
): Promise<ExecutionOutcome> {
  const workerClient = new WorkerClient(
    new Worker("/workers/python/pyodide-worker.mjs", { type: "module" }),
  );

  console.log("Running Python computation in background thread...");

  const workerResponse = await workerClient.run(userCode);

  console.log({
    trace: workerResponse.trace,
    duration: workerResponse.duration?.toFixed(2),
  });

  console.log("Pyodide execution success!");

  workerClient.terminate();

  return workerResponse;
}

export async function executeTraceForTestCases(
  userCode: string,
  testCases: TraceTestCase[],
  execution: ExecutionOptions,
): Promise<TestCaseExecutionOutcome[]> {
  const workerClient = new WorkerClient(
    new Worker("/workers/python/pyodide-worker.mjs", { type: "module" }),
  );

  try {
    const outcomes: TestCaseExecutionOutcome[] = [];
    const visibleTestCases = testCases.filter(({ is_hidden }) => !is_hidden);
    const inputs = visibleTestCases.map(({ input }) => input);

    for (const [index, input] of inputs.entries()) {
        // Make it work for any function.
      const outcome = await workerClient.run(userCode, input, execution);

      outcomes.push({
        testCaseId: visibleTestCases[index].id,
        trace: outcome.trace,
        duration: outcome.duration,
      });
    }

    return outcomes;
  } finally {
    workerClient.terminate();
  }
}
