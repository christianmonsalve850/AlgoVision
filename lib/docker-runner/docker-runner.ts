import { ExecutionPayload, ExecutionResult } from "@/lib/docker-runner/types";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";

export function executePython(internalPayload: ExecutionPayload): Promise<ExecutionResult> {
    return new Promise((resolve, reject) => {
        const containerName = `algovision-python-container-${randomUUID()}`;
        const container = spawn("docker", [
            "run",
            "--rm",
            "--name",
            containerName,
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

        let terminationReason: "timeout" | "output-limit" | "error-limit" | null = null;
        const terminateContainer = (reason: "timeout" | "output-limit" | "error-limit") => {
            if (terminationReason !== null) {
                return;
            }

            terminationReason = reason;
            const kill = spawn("docker", ["kill", containerName]);
            let killError = "";
            kill.stderr.setEncoding("utf-8");
            kill.stderr.on("data", (output) => {
                killError += output;
            });
            kill.on("error", (error) => {
                console.error(`Failed to kill container ${containerName}:`, error);
            });
            kill.on("close", (code) => {
                if (code !== 0) {
                    console.error(`Failed to kill container ${containerName}: ${killError}`);
                }
            });
        };

        const timeout = setTimeout(() => {
            terminateContainer("timeout");
        }, 3000);

        let stdout = "";
        let stdoutBytes = 0;
        let stderr = "";
        let stderrBytes = 0

        container.stdout.setEncoding("utf-8");
        container.stderr.setEncoding("utf-8");

        const MAX_OUTPUT_SIZE = 1024 * 10;

        container.stdout.on("data", (chunk) => {
            const chunkBytes = Buffer.byteLength(chunk, "utf-8");
            if (stdoutBytes + chunkBytes > MAX_OUTPUT_SIZE) {
                terminateContainer("output-limit");
                return;
            }

            stdoutBytes += chunkBytes;
            stdout += chunk;
        })

        container.stderr.on("data", (chunk) => {
            const chunkBytes = Buffer.byteLength(chunk, "utf-8");
            if (stderrBytes + chunkBytes > MAX_OUTPUT_SIZE) {
                terminateContainer("error-limit");
                return;
            }
            stderrBytes += chunkBytes;
            stderr += chunk;
        })

        container.on("error", (err) => {
            clearTimeout(timeout);
            reject(new Error(`Failed to start Docker process: ${err.message}`));
        })


        container.on("close", (code) => {
            clearTimeout(timeout);
            if (terminationReason === "output-limit") {
                return reject(new Error(`Execution output exceeded the ${MAX_OUTPUT_SIZE}-byte limit`));
            }
            if (terminationReason === "error-limit") {
                return reject(new Error(`Execution error exceeded the ${MAX_OUTPUT_SIZE}-byte limit`));
            }
            if (terminationReason === "timeout") {
                return reject(new Error("Execution timed out after 3000 ms"));
            }
            if (code !== 0) {
                return reject(new Error(`Runner returned invalid JSON. Raw output: ${stderr}`))
            }
            try {
                const result = JSON.parse(stdout) as ExecutionResult;
                resolve(result);
            } catch {
                reject(new Error(`Runner returned invalid JSON. Raw output: ${stdout}`))
            }
        });
        container.stdin.write(JSON.stringify(internalPayload));
        container.stdin.end();
    }); 
}