import { handler } from "./handler";
const index = Bun.argv.indexOf("--port");
const port = index === -1 ? 9940 : Number(Bun.argv[index + 1]);
if (!Number.isInteger(port) || port < 1 || port > 65535)
{
    throw new Error("Invalid --port");
}
const server = Bun.serve({
    hostname: "0.0.0.0",
    port,
    maxRequestBodySize: 26,
    idleTimeout: 5,
    fetch: handler(),
});
console.info(`Realm de desenvolvimento: http://localhost:${server.port}`);
for (const signal of ["SIGINT", "SIGTERM"] as const)
{
    process.on(signal, () => {
        server.stop(true);
        process.exit(0);
    });
}
