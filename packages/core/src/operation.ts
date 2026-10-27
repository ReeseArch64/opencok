import { context, ROOT_CONTEXT, SpanKind } from "@opentelemetry/api";
import { randomUUID } from "node:crypto";
import { Effect } from "effect";
import { errorReason, logEvent, withLogContext } from "./logging.ts";
import { telemetry, tracePropagation } from "./telemetry.ts";

type Fields = Record<string, string | number | boolean | undefined>;

export function observeServerOperation<T>(operation: string, run: () => T, fields: Fields = {}): T {
  return observeOperation(operation, run, fields, SpanKind.SERVER);
}

export function observeDependencyOperation<T>(
  operation: string,
  run: () => T,
  fields: Fields = {},
): T {
  return observeOperation(operation, run, fields, SpanKind.CLIENT);
}

export function observeOperation<T>(
  operation: string,
  run: () => T,
  fields: Fields = {},
  kind = SpanKind.INTERNAL,
): T {
  const execute = () =>
    withLogContext({ operation, ...fields }, () => {
      const started = performance.now();
      let slow: ReturnType<typeof setTimeout> | undefined;
      telemetry?.inFlight(1, operation);
      logEvent("operation_started", { operation });
      const finish = (failed: boolean, error?: unknown, value?: unknown) => {
        clearTimeout(slow);
        telemetry?.inFlight(-1, operation);
        const status = value instanceof Response ? value.status : undefined;
        const rejected = failed || (status !== undefined && status >= 400);
        logEvent(
          failed ? "operation_failed" : "operation_completed",
          {
            operation,
            outcome: rejected ? "failure" : "success",
            status,
            reason: failed ? errorReason(error) : undefined,
            durationMs: performance.now() - started,
            resultCount: Array.isArray(value) ? value.length : undefined,
          },
          failed || (status !== undefined && status >= 500) ? "error" : rejected ? "warn" : "info",
        );
      };
      try {
        const value = run();
        if (value instanceof Promise) {
          slow = setTimeout(
            () =>
              logEvent(
                "operation_slow",
                { operation, durationMs: performance.now() - started, reason: "processing_delay" },
                "warn",
              ),
            telemetry?.slowOperationMs ?? 1000,
          );
          slow.unref();
          return value.then(
            (result) => {
              finish(false, undefined, result);
              return result;
            },
            (error) => {
              finish(true, error);
              throw error;
            },
          ) as T;
        }
        finish(false, undefined, value);
        return value;
      } catch (error) {
        finish(true, error);
        throw error;
      }
    });
  if (!telemetry) return execute();

  const attributes = Object.fromEntries(
    Object.entries(fields).filter(
      (entry): entry is [string, string | number | boolean] =>
        entry[1] !== undefined &&
        [
          "component",
          "databaseRole",
          "table",
          "db.system.name",
          "db.operation.name",
          "kingdom",
        ].includes(entry[0]),
    ),
  );
  return telemetry.tracer.startActiveSpan(operation, { kind, attributes }, (span) => {
    try {
      const value = execute();
      if (value instanceof Promise) return value.finally(() => span.end()) as T;
      span.end();
      return value;
    } catch (error) {
      span.end();
      throw error;
    }
  });
}

const instrumented = new WeakSet<object>();

export function observeAdapter<T>(target: T, component: string): T {
  if (Effect.isEffect(target)) return target;
  if (typeof target === "function") {
    return function (this: unknown, ...args: unknown[]) {
      return observeOperation(component, () => Reflect.apply(target, this, args));
    } as T;
  }
  if (target && typeof target === "object") return observeMethods(target, component);
  return target;
}

export function observeMethods<T extends object>(target: T, component: string): T {
  if (instrumented.has(target)) return target;
  instrumented.add(target);
  const names = new Set<string>();
  for (
    let prototype: object | null = target;
    prototype && prototype !== Object.prototype;
    prototype = Object.getPrototypeOf(prototype)
  ) {
    for (const name of Object.getOwnPropertyNames(prototype)) {
      if (name === "constructor" || names.has(name)) continue;
      names.add(name);
      const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
      if (typeof descriptor?.value !== "function") continue;
      const method = descriptor.value;
      Object.defineProperty(target, name, {
        configurable: true,
        enumerable: descriptor.enumerable,
        writable: true,
        value: function (this: T, ...args: unknown[]) {
          return observeOperation(`${component}.${name}`, () => Reflect.apply(method, this, args));
        },
      });
    }
  }
  return target;
}

export function observeJob<T>(operation: string, run: () => T): T {
  return context.with(ROOT_CONTEXT, () =>
    withLogContext(
      {
        requestId: undefined,
        connectionId: undefined,
        operationId: undefined,
        command: undefined,
        commandHash: undefined,
        mutationRef: undefined,
        jobId: `job_${randomUUID().replaceAll("-", "")}`,
      },
      () => observeOperation(operation, run),
    ),
  );
}

export function incomingTrace<T>(headers: Headers, run: () => T): T {
  const parent = tracePropagation.extract(context.active(), headers, {
    keys: (carrier) => [...carrier.keys()],
    get: (carrier, key) => carrier.get(key) ?? undefined,
  });
  return context.with(parent, run);
}

export function outgoingTrace(headers: Headers): Headers {
  tracePropagation.inject(context.active(), headers, {
    set: (carrier, key, value) => carrier.set(key, value),
  });
  return headers;
}
