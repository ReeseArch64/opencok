import { expect, test } from "bun:test";
import { telemetrySchema } from "../src/telemetry";

test("telemetry is optional and its timing and authenticated endpoint settings are bounded", () => {
  expect(telemetrySchema.parse({})).toEqual({
    endpoint: undefined,
    ingestKey: undefined,
    environment: "development",
    intervalMs: 1000,
    slowOperationMs: 1000,
  });
  expect(
    telemetrySchema.parse({
      OTEL_EXPORTER_OTLP_ENDPOINT: "http://maple:4318",
      MAPLE_LOCAL_INGEST_KEY: "synthetic-ingest-key",
      OTEL_EXPORT_INTERVAL_MS: "2000",
      OTEL_SLOW_OPERATION_MS: "250",
    }),
  ).toMatchObject({ endpoint: "http://maple:4318", intervalMs: 1000, slowOperationMs: 250 });
  for (const input of [
    { OTEL_EXPORTER_OTLP_ENDPOINT: "http://private-user:private-password@host" },
    { OTEL_EXPORTER_OTLP_ENDPOINT: "http://host/?token=private-token" },
    { OTEL_EXPORTER_OTLP_ENDPOINT: "file:///tmp/telemetry" },
    { MAPLE_LOCAL_INGEST_KEY: "short" },
    { OTEL_SLOW_OPERATION_MS: "-1" },
  ])
    expect(telemetrySchema.safeParse(input).success).toBe(false);
});
