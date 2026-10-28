import { expect, spyOn, test } from "bun:test";
import { initializeLogging, initializeTelemetry, logEvent, logHttpRequest } from "../src/logging";
import { observedFetch } from "../src/fetch";
import { observeOperation } from "../src/operation";

test("OTLP exports correlated redacted logs, parented spans, exceptions and duration metrics", async () => {
    const received: { signal: string; body: any; }[] = [];
    const collector = Bun.serve({
        hostname: "127.0.0.1",
        port: 0,
        async fetch(request)
        {
            expect(request.headers.get("authorization")).toBe("Bearer synthetic-ingest-key");
            received.push({ signal: new URL(request.url).pathname, body: await request.json() });
            return Response.json({});
        },
    });
    initializeLogging("telemetry-test");
    const spies = ["log", "info", "warn", "error"].map((method) =>
        spyOn(console, method as "log").mockImplementation(() => {})
    );
    const active = initializeTelemetry("telemetry-test", {
        endpoint: `http://127.0.0.1:${collector.port}`,
        ingestKey: "synthetic-ingest-key",
    })!;
    try
    {
        await logHttpRequest(
            new Request("http://localhost/readyz", {
                headers: { traceparent: "00-1234567890abcdef1234567890abcdef-1234567890abcdef-01" },
            }),
            async () => {
                await observeOperation(
                    "database.read",
                    async () => logEvent("credential", { authorization: "Bearer private-token" }),
                );
                await observedFetch("remote.call", "http://unused", {}, async (_url, options) => {
                    expect(new Headers(options.headers).get("traceparent")).toMatch(
                        /^00-1234567890abcdef1234567890abcdef-/,
                    );
                    return new Response("ok");
                });
                await expect(
                    observeOperation("database.failure", async () => {
                        throw new Error("private-database-password");
                    }),
                ).rejects.toThrow();
                return new Response("ok");
            },
        );
        await active.flush();
        expect(new Set(received.map((entry) => entry.signal))).toEqual(
            new Set(["/v1/traces", "/v1/logs", "/v1/metrics"]),
        );
        const spans = received
            .filter((entry) => entry.signal === "/v1/traces")
            .flatMap((entry) =>
                entry.body.resourceSpans.flatMap((resource: any) =>
                    resource.scopeSpans.flatMap((scope: any) => scope.spans)
                )
            );
        expect(spans).toHaveLength(4);
        expect(new Set(spans.map((span: any) => span.traceId))).toEqual(
            new Set(["1234567890abcdef1234567890abcdef"]),
        );
        expect(spans.find((span: any) => span.name === "database.failure").events[0].name).toBe(
            "exception",
        );
        const metrics = received
            .filter((entry) => entry.signal === "/v1/metrics")
            .flatMap((entry) =>
                entry.body.resourceMetrics.flatMap((resource: any) =>
                    resource.scopeMetrics.flatMap((scope: any) => scope.metrics)
                )
            );
        expect(metrics.some((metric: any) => metric.name === "opencok.operation.duration")).toBe(
            true,
        );
        expect(JSON.stringify(metrics)).not.toMatch(/requestId|traceId|spanId/);
        expect(JSON.stringify(received)).not.toContain("private-");
        expect(JSON.stringify(received.filter((entry) => entry.signal === "/v1/logs"))).toContain(
            "traceId",
        );
    }
    finally
    {
        await active.close();
        collector.stop(true);
        spies.forEach((spy) => spy.mockRestore());
    }
});

test("an unavailable collector cannot block operations and export recovers without leaking diagnostics", async () => {
    let healthy = false;
    let accepted = 0;
    const collector = Bun.serve({
        hostname: "127.0.0.1",
        port: 0,
        fetch()
        {
            if (!healthy)
            {
                return new Response("private-collector-response", { status: 400 });
            }
            accepted++;
            return Response.json({});
        },
    });
    initializeLogging("outage-test");
    const records: string[] = [];
    const spies = ["log", "info", "warn", "error"].map((method) =>
        spyOn(console, method as "log").mockImplementation((value) => records.push(String(value)))
    );
    const active = initializeTelemetry("outage-test", {
        endpoint: `http://127.0.0.1:${collector.port}`,
        ingestKey: "synthetic-outage-key",
    })!;
    try
    {
        const started = performance.now();
        expect(await observeOperation("available.work", async () => 42)).toBe(42);
        expect(performance.now() - started).toBeLessThan(500);
        await active.flush().catch(() => {});
        expect(records.some((record) => record.includes("telemetry_export_failed"))).toBe(true);
        expect(records.join("\n")).not.toMatch(/private-|synthetic-outage-key/);
        healthy = true;
        await observeOperation("recovered.work", async () => logEvent("recovered"));
        await active.flush();
        expect(accepted).toBeGreaterThan(0);
    }
    finally
    {
        healthy = true;
        await active.close();
        collector.stop(true);
        spies.forEach((spy) => spy.mockRestore());
    }
});
