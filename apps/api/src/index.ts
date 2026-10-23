import { createApp } from "./app.ts";
import { readConfig } from "./config.ts";

try {
  const config = readConfig();
  const app = await createApp(config);
  const server = Bun.serve({
    hostname: config.host,
    port: config.port,
    maxRequestBodySize: 65536,
    idleTimeout: 20,
    fetch: (request) => app.fetch(request),
    error: () => new Response("", { status: 500 }),
  });
  console.info(JSON.stringify({ event: "listening", host: config.host, port: server.port }));
  let stopping = false;
  const stop = async () => {
    if (stopping) return;
    stopping = true;
    await server.stop();
    await app.close();
    process.exit(0);
  };
  process.on("SIGTERM", stop);
  process.on("SIGINT", stop);
} catch {
  console.error(
    JSON.stringify({ event: "startup_failed", hint: "Check API configuration and resource files" }),
  );
  process.exitCode = 1;
}
