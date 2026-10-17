export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Keep the Node-only runner out of browser and Edge instrumentation bundles.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("./instrumentation.node").register();
  }
}
