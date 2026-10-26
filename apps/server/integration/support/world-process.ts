import type { ServerConfig } from "@opencok/contracts/server";
import { isRecord } from "@opencok/contracts/chat";
async function bounded<T>(operation: Promise<T>, milliseconds: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error("Synthetic world process timed out")),
          milliseconds,
        );
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}
export async function startWorldProcess(config: ServerConfig) {
  let accept: (value: { port: number; healthPort: number }) => void, reject: (error: Error) => void;
  const ready = new Promise<{ port: number; healthPort: number }>((resolve, fail) => {
    accept = resolve;
    reject = fail;
  });
  const child = Bun.spawn(
    [
      process.execPath,
      "--no-env-file",
      new URL("./world-process-worker.ts", import.meta.url).pathname,
    ],
    {
      env: { OPENCOK_WORLD_TEST_CONFIG: JSON.stringify(config) },
      stdout: "ignore",
      stderr: "ignore",
      ipc(message: unknown) {
        if (!isRecord(message)) return;
        if (
          message.type === "ready" &&
          typeof message.port === "number" &&
          typeof message.healthPort === "number"
        )
          accept({ port: message.port, healthPort: message.healthPort });
        if (message.type === "failed") reject(new Error("Synthetic world process startup failed"));
      },
    },
  );
  const crash = async () => {
    if (child.exitCode === null) child.kill("SIGKILL");
    await child.exited;
  };
  const close = async () => {
    if (child.exitCode !== null) return;
    child.kill("SIGTERM");
    try {
      await bounded(child.exited, 5000);
    } catch {
      await crash();
    }
  };
  try {
    const address = await bounded(
      Promise.race([
        ready,
        child.exited.then(() => {
          throw new Error("Synthetic world process exited during startup");
        }),
      ]),
      20000,
    );
    return { ...address, pid: child.pid, close, crash };
  } catch (error) {
    await close();
    throw error;
  }
}
