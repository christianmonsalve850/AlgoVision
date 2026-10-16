import { warmPythonRunner } from "./lib/docker-runner/docker-runner";

export async function register() {
  try {
    await warmPythonRunner();
  } catch (error) {
    console.error("Failed to warm the Python execution worker:", error);
  }
}
