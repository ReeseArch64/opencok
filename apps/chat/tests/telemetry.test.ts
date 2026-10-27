import { expect, test } from "bun:test";
import { once } from "node:events";
import { initializeLogging, initializeTelemetry } from "@opencok/core/logging";
import { telemetrySchema } from "@opencok/env/telemetry";
import { ChatHttpServer } from "@opencok/connection/chat-http-server";

test("chat HTTP exports authenticated redacted logs, failure traces and duration metrics", async () => {
  const records: { path: string; body: any }[] = [];
  const collector = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    async fetch(request) {
      expect(request.headers.get("authorization")).toBe("Bearer synthetic-chat-ingest-key");
      records.push({ path: new URL(request.url).pathname, body: await request.json() });
      return Response.json({});
    },
  });
  initializeLogging("chat");
  const active = initializeTelemetry(
    "chat",
    telemetrySchema.parse({
      OTEL_EXPORTER_OTLP_ENDPOINT: `http://127.0.0.1:${collector.port}`,
      MAPLE_LOCAL_INGEST_KEY: "synthetic-chat-ingest-key",
      NODE_ENV: "test",
    }),
  )!;
  const { server } = new ChatHttpServer({ isReady: () => false });
  try {
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Missing port");
    const response = await fetch(`http://127.0.0.1:${address.port}/_health?private-token=secret`, {
      headers: { authorization: "Bearer private-chat-token", uid: "private-player" },
    });
    expect(response.status).toBe(404);
    await response.text();
    const unavailable = await fetch(`http://127.0.0.1:${address.port}/_health`);
    expect(unavailable.status).toBe(503);
    await unavailable.text();
    await active.flush();
    expect(new Set(records.map((record) => record.path))).toEqual(
      new Set(["/v1/logs", "/v1/traces", "/v1/metrics"]),
    );
    const logs = records.flatMap((record) => record.body.resourceLogs ?? []);
    expect(
      logs.some((resource: any) =>
        resource.resource.attributes.some(
          (attribute: any) =>
            attribute.key === "service.name" && attribute.value.stringValue === "chat",
        ),
      ),
    ).toBe(true);
    expect(JSON.stringify(records)).toContain("opencok.operation.duration");
    expect(JSON.stringify(records)).not.toMatch(/private-|secret/);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await active.close();
    collector.stop(true);
  }
});
