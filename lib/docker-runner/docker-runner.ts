import type { ChildProcessWithoutNullStreams } from "node:child_process";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import type { ExecutionPayload, ExecutionResult } from "@/lib/docker-runner/types";

const EXECUTION_TIMEOUT_MS = 3000;
const STARTUP_TIMEOUT_MS = 30_000;
const MAX_OUTPUT_SIZE = 1024 * 10;

interface ExecutionJob {
  id: string;
  payload: ExecutionPayload;
  resolve: (result: ExecutionResult) => void;
  reject: (error: Error) => void;
}

interface WorkerMessage {
  ready?: boolean;
  requestId?: string;
  result?: ExecutionResult;
  error?: string;
}

class PythonExecutionWorker {
  private container: ChildProcessWithoutNullStreams | null = null;
  private containerName: string | null = null;
  private ready = false;
  private startPromise: Promise<void> | null = null;
  private resolveStart: (() => void) | null = null;
  private rejectStart: ((error: Error) => void) | null = null;
  private startupTimeout: ReturnType<typeof setTimeout> | null = null;
  private executionTimeout: ReturnType<typeof setTimeout> | null = null;
  private stdoutBuffer = "";
  private stderr = "";
  private terminationReason:
    | "timeout"
    | "output-limit"
    | "protocol-error"
    | "startup-timeout"
    | null = null;
  private activeJob: ExecutionJob | null = null;
  private readonly queue: ExecutionJob[] = [];

  execute(payload: ExecutionPayload): Promise<ExecutionResult> {
    return new Promise((resolve, reject) => {
      this.queue.push({ id: randomUUID(), payload, resolve, reject });

      void this.start()
        .then(() => this.dispatchNext())
        .catch((error: unknown) => {
          this.failQueued(
            error instanceof Error ? error : new Error(String(error)),
          );
        });
    });
  }

  async warm(): Promise<void> {
    await this.start();
  }

  private start(): Promise<void> {
    if (this.ready) {
      return Promise.resolve();
    }
    if (this.startPromise) {
      return this.startPromise;
    }

    this.startPromise = new Promise<void>((resolve, reject) => {
      this.resolveStart = resolve;
      this.rejectStart = reject;
      this.stdoutBuffer = "";
      this.stderr = "";
      this.terminationReason = null;
      this.containerName = `algovision-python-worker-${randomUUID()}`;
      this.container = spawn("docker", [
        "run",
        "--rm",
        "--name",
        this.containerName,
        "--memory",
        "128m",
        "--memory-swap",
        "128m",
        "--cpus",
        "0.5",
        "--pids-limit",
        "64",
        "--network",
        "none",
        "--read-only",
        "--cap-drop",
        "ALL",
        "--security-opt=no-new-privileges",
        "-i",
        "algovision-python-runner:dev",
      ]);

      this.container.stdout.setEncoding("utf-8");
      this.container.stderr.setEncoding("utf-8");
      this.container.stdout.on("data", (chunk: string) => this.readStdout(chunk));
      this.container.stderr.on("data", (chunk: string) => {
        if (Buffer.byteLength(this.stderr) < MAX_OUTPUT_SIZE) {
          this.stderr = (this.stderr + chunk).slice(0, MAX_OUTPUT_SIZE);
        }
      });
      this.container.on("error", (error) => {
        this.rejectStart?.(
          new Error(`Failed to start Docker worker: ${error.message}`),
        );
      });
      this.container.on("close", (code) => this.handleClose(code));

      this.startupTimeout = setTimeout(() => {
        this.terminationReason = "startup-timeout";
        this.terminateContainer();
        this.container?.kill("SIGTERM");
      }, STARTUP_TIMEOUT_MS);
    });

    return this.startPromise;
  }

  private readStdout(chunk: string): void {
    this.stdoutBuffer += chunk;

    let newlineIndex = this.stdoutBuffer.indexOf("\n");
    while (newlineIndex !== -1) {
      const line = this.stdoutBuffer.slice(0, newlineIndex).replace(/\r$/, "");
      this.stdoutBuffer = this.stdoutBuffer.slice(newlineIndex + 1);
      if (Buffer.byteLength(line, "utf-8") > MAX_OUTPUT_SIZE) {
        this.terminateFor("output-limit");
        return;
      }
      this.handleLine(line);
      newlineIndex = this.stdoutBuffer.indexOf("\n");
    }

    if (Buffer.byteLength(this.stdoutBuffer, "utf-8") > MAX_OUTPUT_SIZE) {
      this.terminateFor("output-limit");
    }
  }

  private handleLine(line: string): void {
    if (this.terminationReason !== null) {
      return;
    }

    let message: WorkerMessage;
    try {
      message = JSON.parse(line) as WorkerMessage;
    } catch {
      this.terminateFor("protocol-error");
      return;
    }

    if (message.ready && !this.ready) {
      this.ready = true;
      if (this.startupTimeout) {
        clearTimeout(this.startupTimeout);
        this.startupTimeout = null;
      }
      this.resolveStart?.();
      this.resolveStart = null;
      this.rejectStart = null;
      this.startPromise = null;
      this.dispatchNext();
      return;
    }

    const job = this.activeJob;
    if (!job || message.requestId !== job.id) {
      this.terminateFor("protocol-error");
      return;
    }

    if (this.executionTimeout) {
      clearTimeout(this.executionTimeout);
      this.executionTimeout = null;
    }
    this.activeJob = null;

    if (message.error) {
      job.reject(new Error(message.error));
    } else if (message.result) {
      job.resolve(message.result);
    } else {
      job.reject(new Error("Python worker returned an invalid response"));
    }

    this.dispatchNext();
  }

  private dispatchNext(): void {
    if (!this.ready || this.activeJob || !this.container) {
      return;
    }

    const job = this.queue.shift();
    if (!job) {
      return;
    }

    this.activeJob = job;
    this.executionTimeout = setTimeout(() => {
      this.terminationReason = "timeout";
      this.terminateContainer();
    }, EXECUTION_TIMEOUT_MS);

    this.container.stdin.write(
      `${JSON.stringify({ requestId: job.id, payload: job.payload })}\n`,
      (error) => {
        if (error) {
          this.container?.kill("SIGTERM");
        }
      },
    );
  }

  private terminateFor(reason: "output-limit" | "protocol-error"): void {
    if (this.terminationReason !== null) {
      return;
    }
    this.terminationReason = reason;
    this.terminateContainer();
  }

  private terminateContainer(): void {
    if (!this.containerName) {
      return;
    }

    const name = this.containerName;
    const kill = spawn("docker", ["kill", name]);
    let killError = "";
    kill.stderr.setEncoding("utf-8");
    kill.stderr.on("data", (output: string) => {
      killError += output;
    });
    kill.on("error", (error) => {
      console.error(`Failed to kill Python worker ${name}:`, error);
    });
    kill.on("close", (code) => {
      if (code !== 0) {
        console.error(`Failed to kill Python worker ${name}: ${killError}`);
      }
    });
  }

  private handleClose(code: number | null): void {
    const wasReady = this.ready;
    this.ready = false;
    this.container = null;
    this.containerName = null;
    if (this.startupTimeout) {
      clearTimeout(this.startupTimeout);
      this.startupTimeout = null;
    }
    if (this.executionTimeout) {
      clearTimeout(this.executionTimeout);
      this.executionTimeout = null;
    }
    this.startPromise = null;

    const startupError = new Error(
      this.terminationReason === "startup-timeout"
        ? `Python worker did not become ready within ${STARTUP_TIMEOUT_MS} ms`
        : `Python worker exited before becoming ready (code ${code}): ${this.stderr}`,
    );
    this.rejectStart?.(startupError);
    this.resolveStart = null;
    this.rejectStart = null;

    const job = this.activeJob;
    this.activeJob = null;
    if (job) {
      if (this.terminationReason === "timeout") {
        job.reject(new Error(`Execution timed out after ${EXECUTION_TIMEOUT_MS} ms`));
      } else if (this.terminationReason === "output-limit") {
        job.reject(new Error(`Execution output exceeded the ${MAX_OUTPUT_SIZE}-byte limit`));
      } else if (this.terminationReason === "protocol-error") {
        job.reject(new Error("Python worker returned an invalid response"));
      } else {
        job.reject(
          new Error(`Python worker exited unexpectedly (code ${code}): ${this.stderr}`),
        );
      }
    }

    if (wasReady) {
      void this.start()
        .then(() => this.dispatchNext())
        .catch((error: unknown) => {
          this.failQueued(
            error instanceof Error ? error : new Error(String(error)),
          );
        });
    }
  }

  private failQueued(error: Error): void {
    while (this.queue.length > 0) {
      this.queue.shift()?.reject(error);
    }
  }
}

const pythonWorker = new PythonExecutionWorker();

export function executePython(
  internalPayload: ExecutionPayload,
): Promise<ExecutionResult> {
  return pythonWorker.execute(internalPayload);
}

export function warmPythonRunner(): Promise<void> {
  return pythonWorker.warm();
}
