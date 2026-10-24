import index from "./index.html";
import { createPingHandler } from "./ping";

const server = Bun.serve({
  hostname: "0.0.0.0",
  port: 5173,
  development: process.env.NODE_ENV !== "production",
  routes: {
    "/": index,
    "/api/ping": { GET: createPingHandler() },
  },
  fetch() {
    return new Response("Not found", { status: 404 });
  },
});

console.log(`OpenCok Web: ${server.url}`);
