import { ExecutionPayload, ExecutionResult } from "@/lib/docker-runner/types";
import { spawn } from "node:child_process";

export function executePython(internalPayload: ExecutionPayload): Promise<ExecutionResult> {
    return new Promise((resolve, reject) => {
        const container = spawn("docker", [
            "run",
            "--rm",
            "-i",
            "algovision-python-runner:dev",
        ]);
        
        let stdout = "";
        let stderr = "";
        
        container.stdout.setEncoding("utf-8"); 
        container.stderr.setEncoding("utf-8");

        container.stdout.on("data", (chunk) => {
            stdout += chunk;
        })

        container.stderr.on("data", (chunk) => {
            stderr += chunk;
        })

        container.on("error", (err) => {
            reject(new Error(`Failed to start Docker process: ${err.message}`));
        })


        container.on("close", (code) => {
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