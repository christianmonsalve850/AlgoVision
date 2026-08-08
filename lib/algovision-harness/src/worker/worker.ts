// worker/worker.ts
/// <reference lib="webworker" />

import { RuntimeAdapter, createRuntime } from "../runtime/runtime-factory";
import { WorkerRequest, WorkerResponse, createWorkerErrorResponse, createWorkerSuccessResponse } from "../runtime/messages";

const runtime: RuntimeAdapter = createRuntime("python");

/**
 * Background Thread Router
 * Listens for cross-thread postMessage signals coming from WorkerClient.ts
 */
self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const message = event.data;

  switch (message.type) {
    case "INITIALIZE":
      try {
        await runtime.initialize();
        self.postMessage({ type: "INITIALIZED" } as WorkerResponse);
      } catch (err: any) {
        self.postMessage(createWorkerErrorResponse(err.message || "Failed to boot WebAssembly compilation context."));
      }
      break;

    case "RUN":
      try {
        const executionResult = await runtime.runWithMetadata(String(message.userCode));
        self.postMessage(createWorkerSuccessResponse(executionResult.trace, executionResult.duration));
      } catch (err: any) {
        self.postMessage(createWorkerErrorResponse(err.message || "Runtime execution tracking exception."));
      }
      break;
  }
};