const fs = require("fs");
const Module = require("module");
const path = require("path");
const { EventEmitter } = require("events");
const { PassThrough, Writable } = require("stream");
const childProcess = require("child_process");
const realSpawn = childProcess.spawn.bind(childProcess);

const options = JSON.parse(fs.readFileSync(0, "utf8"));
const workers = [];
const dockerRunArgs = [];

class FakeChild extends EventEmitter {
  constructor(onWrite) {
    super();
    this.stdout = new PassThrough();
    this.stderr = new PassThrough();
    this.stdin = new Writable({
      write(chunk, encoding, callback) {
        onWrite?.(chunk.toString());
        callback();
      },
    });
  }
}

childProcess.spawn = (command, args) => {
  if (options.simulation === "real-docker") {
    if (args[0] === "run") {
      args = [...args];
      args[args.length - 1] = options.imageName;
    }
    return realSpawn(command, args);
  }

  if (args[0] === "kill") {
    const child = new FakeChild();
    setImmediate(() => {
      workers.at(-1)?.emit("close", 137);
      child.stderr.end();
      child.emit("close", 0);
    });
    return child;
  }

  if (args[0] !== "run") {
    throw new Error(`Unexpected process: ${command} ${args.join(" ")}`);
  }

  const worker = new FakeChild((line) => {
    if (!line.includes('"payload"')) {
      return;
    }

    if (options.simulation === "output") {
      worker.stdout.write("x".repeat(options.maxOutputBytes + 1));
    } else if (options.simulation === "success") {
      const request = JSON.parse(line);
      worker.stdout.write(JSON.stringify({
        requestId: request.requestId,
        result: { status: "completed" },
      }) + "\n");
    }
  });
  dockerRunArgs.push(args);
  workers.push(worker);
  setImmediate(() => worker.stdout.write('{"ready":true}\n'));
  return worker;
};

const filename = path.resolve(options.runnerPath);
const source = fs.readFileSync(filename, "utf8");
const ts = require("typescript");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;
const runnerModule = new Module(filename, module);
runnerModule.filename = filename;
runnerModule.paths = Module._nodeModulePaths(path.dirname(filename));
runnerModule._compile(compiled, filename);

runnerModule.exports[options.exportName](options.payload).then(
  (result) => {
    console.log(JSON.stringify({ resolved: true, result, dockerRunArgs }));
    process.exit(0);
  },
  (error) => {
    console.log(JSON.stringify({ resolved: false, error: error.message }));
    process.exit(0);
  },
);
