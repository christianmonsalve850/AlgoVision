import { WorkerClient } from "./runtime/worker-client";
import type { ExecutionOutcome } from "./runtime/types";

export async function executeTrace(userCode: string): Promise<ExecutionOutcome> {
    const workerClient = new WorkerClient(
        new Worker("/workers/python/pyodide-worker.mjs", { type: "module" }),
    );

    console.log("Running Python computation in background thread...");

    const workerResponse = await workerClient.run(userCode)
    
    console.log(
        {
            trace: workerResponse.trace, 
            duration: workerResponse.duration?.toFixed(2)
        }
    );

    console.log("Pyodide execution success!");

    workerClient.terminate();

    return workerResponse;
}
