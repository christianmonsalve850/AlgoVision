export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  const { warmPythonRunner } = await import("./lib/docker-runner/docker-runner");

  try {
    await warmPythonRunner();
  } catch (error) {
    console.error("Failed to warm the Python execution worker:", error);
  }
}
