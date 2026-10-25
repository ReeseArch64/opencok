import { afterEach, beforeEach, expect, spyOn, test } from "bun:test";
import * as crypto from "node:crypto";
import { Effect } from "effect";
import {
  initializeLogging,
  logContext,
  logEvent,
  logHttpRequest,
  withLogContext,
} from "../src/logging";
import { fromPromise } from "../src/resource";

let records: Record<string, unknown>[];
let restore: (() => void)[];
beforeEach(() => {
  initializeLogging("logging-test");
  records = [];
  restore = ["log", "info", "warn", "error"].map((method) => {
    const spy = spyOn(console, method as "log").mockImplementation((value) => {
      records.push(JSON.parse(String(value)));
    });
    return () => spy.mockRestore();
  });
});
afterEach(() => restore.forEach((restore) => restore()));

test("JSON events retain severity, success, correlation and automatic secret redaction", () => {
  withLogContext({ connectionId: "synthetic-connection" }, () => {
    logEvent("completed", { outcome: "success" });
    logEvent("rejected", { reason: "protocol_shape" }, "warn");
    logEvent("failed", { authorization: "Bearer private-token" }, "error");
  });
  expect(records.map((record) => record.level)).toEqual(["info", "warn", "error"]);
  expect(records[0]).toMatchObject({
    event: "completed",
    service: "logging-test",
    outcome: "success",
    connectionId: "synthetic-connection",
  });
  expect(JSON.stringify(records)).not.toContain("private-token");
  expect(records[0]!.timestamp).toBeString();
  expect(logContext()).toEqual({});
});

test("parallel and nested HTTP logging keeps independent IDs and emits once per request", async () => {
  const response = await Promise.all(
    ["first", "second"].map((secret) => {
      const request = new Request(`http://localhost/private-${secret}?token=private-token`, {
        headers: { authorization: "Bearer private-token", "X-Request-ID": "untrusted" },
      });
      return logHttpRequest(request, (request) =>
        logHttpRequest(request, async () => {
          const requestId = logContext().requestId;
          await Promise.resolve();
          expect(logContext().requestId).toBe(requestId);
          return new Response("ok");
        }),
      );
    }),
  );
  expect(records).toHaveLength(2);
  const ids = response.map((response) => response.headers.get("X-Request-ID"));
  expect(new Set(ids).size).toBe(2);
  expect(records.map((record) => record.requestId).sort()).toEqual([...ids].sort());
  expect(
    records.every((record) => record.operation === "unknown" && record.outcome === "success"),
  ).toBe(true);
  expect(JSON.stringify(records)).not.toMatch(/private-|untrusted/);
});

test("digit-heavy request IDs survive redaction while credentials remain masked", async () => {
  const uuid = spyOn(crypto, "randomUUID").mockReturnValue("48273837-4629-4286-a709-504965c3e4e6");
  restore.push(() => uuid.mockRestore());
  const response = await logHttpRequest(new Request("http://localhost/readyz"), () => {
    logEvent("credential_check", { authorization: "Bearer private-token" });
    return new Response("ok");
  });
  const requestId = "req_4827383746294286a709504965c3e4e6";
  expect(response.headers.get("X-Request-ID")).toBe(requestId);
  expect(records.map((record) => record.requestId)).toEqual([requestId, requestId]);
  expect(JSON.stringify(records)).not.toContain("private-token");
});

test("HTTP failures carry status and severity without leaking thrown errors", async () => {
  for (const status of [400, 503])
    await logHttpRequest(
      new Request("http://localhost/readyz"),
      () => new Response(null, { status }),
    );
  await expect(
    logHttpRequest(new Request("http://localhost/readyz"), () => {
      throw new Error("private-database-password");
    }),
  ).rejects.toThrow("private-database-password");
  expect(records.map((record) => [record.level, record.status])).toEqual([
    ["warn", 400],
    ["error", 503],
    ["error", 500],
  ]);
  expect(JSON.stringify(records)).not.toContain("private-database-password");
});

test("dependency failures identify the failed operation while keeping error details private", async () => {
  await Effect.runPromiseExit(
    fromPromise("realm.database.start", async () => {
      throw new Error("postgresql://private-user:private-password@private-host");
    }),
  );
  expect(records).toHaveLength(1);
  expect(records[0]).toMatchObject({
    event: "resource_failed",
    operation: "realm.database.start",
    level: "error",
    outcome: "failure",
  });
  expect(records[0]!.durationMs).toBeNumber();
  expect(JSON.stringify(records)).not.toContain("private-");
});

test("known dependency error codes expose actionable controlled reasons", async () => {
  for (const [code, reason] of [
    ["ECONNREFUSED", "connection_refused"],
    ["28P01", "database_authentication"],
    ["EADDRINUSE", "address_in_use"],
  ]) {
    await Effect.runPromiseExit(
      fromPromise("dependency.start", async () => {
        throw Object.assign(new Error("private-connection-string"), { code });
      }),
    );
    expect(records.at(-1)).toMatchObject({ reason, level: "error" });
  }
  expect(JSON.stringify(records)).not.toContain("private-");
});
