import { config } from "./config.ts";
import { startServer } from "./server.ts";

try {
  const settings = config();
  const server = await startServer(settings);
  console.log(
    JSON.stringify({
      event: "started",
      runtime: "bun",
      kingdom: settings.kingdomId,
      port: server.port,
      healthPort: server.healthPort,
      experimental: true,
    }),
  );
  let stopping = false;
  const stop = async () => {
    if (stopping) return;
    stopping = true;
    await server.close();
    console.log(JSON.stringify({ event: "stopped" }));
  };
  process.once("SIGTERM", () => {
    void stop();
  });
  process.once("SIGINT", () => {
    void stop();
  });
} catch {
  console.error(
    JSON.stringify({
      event: "startup_failed",
      hint: "Check configuration, resources, schemas and dependency availability",
    }),
  );
  process.exitCode = 1;
}
