// runtime/WorkerClient.ts

import { WorkerRequest, WorkerResponse } from "./messages";
import { ExecutionOutcome } from "./types";

interface PendingRequest {
  resolve: (value: ExecutionOutcome) => void;
  reject: (reason: unknown) => void;
}

export class WorkerClient {
  private worker: Worker | null = null;
  private readonly workerUrl?: string | URL;
  private pendingRequest: PendingRequest | null = null;
  private initializationPromise: Promise<void> | null = null;

  constructor(worker: Worker);
  constructor(workerUrl: string | URL);
  constructor(workerOrUrl: Worker | string | URL) {
    if (typeof workerOrUrl === "string" || workerOrUrl instanceof URL) {
      this.workerUrl = workerOrUrl;
    } else {
      this.worker = workerOrUrl;
    }
  }

  /**
   * Spins up the background Web Worker thread and kicks off the
   * Pyodide WebAssembly compilation phase.
   */
  public initialize(): Promise<void> {
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = new Promise((resolve, reject) => {
      try {
        if (!this.worker && this.workerUrl) {
          this.worker = new Worker(this.workerUrl, { type: "module" });
        }

        const worker = this.worker;
        if (!worker) {
          reject(new Error("Worker has already been terminated."));
          return;
        }

        worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
          const message = event.data;

          switch (message.type) {
            case "INITIALIZED":
              resolve();
              break;

            case "SUCCESS":
              if (this.pendingRequest) {
                const outcome: ExecutionOutcome = {
                  trace: message.trace ?? [],
                  duration: message.duration,
                };
                this.pendingRequest.resolve(outcome);
                this.clearPendingRequest();
              }
              break;

            case "ERROR":
              if (this.pendingRequest) {
                this.pendingRequest.reject(new Error(message.error || "Execution failed"));
                this.clearPendingRequest();
              } else if (this.initializationPromise) {
                reject(new Error(message.error || "Worker initialization failed"));
              }
              break;
          }
        };

        worker.onerror = (error) => {
          console.error("Critical Web Worker Error:", error);
          if (this.pendingRequest) {
            this.pendingRequest.reject(error);
            this.clearPendingRequest();
          }
          reject(error);
        };

        worker.postMessage({ type: "INITIALIZE" } as WorkerRequest);
      } catch (err) {
        reject(err);
      }
    });

    return this.initializationPromise;
  }

  /**
   * Dispatches code execution to the background thread, returning a promise
   * that resolves once the worker sends back the complete timeline trace.
   */
  public async run(userCode: string): Promise<ExecutionOutcome> {
    await this.initialize();

    if (!this.worker) {
      throw new Error("Worker failed to initialize cleanly.");
    }

    if (this.pendingRequest) {
      throw new Error("A tracing execution pass is already in progress.");
    }

    return new Promise<ExecutionOutcome>((resolve, reject) => {
      this.pendingRequest = { resolve, reject };
      this.worker!.postMessage({
        type: "RUN",
        userCode,
      } as WorkerRequest);
    });
  }

  /**
   * Completely terminates the worker thread, freeing up memory channels.
   */
  public terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.initializationPromise = null;
      this.clearPendingRequest();
    }
  }

  private clearPendingRequest(): void {
    this.pendingRequest = null;
  }
}
