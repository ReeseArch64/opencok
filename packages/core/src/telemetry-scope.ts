import { Cause, Effect, Exit } from "effect";
import { initializeTelemetry, logEvent } from "./logging.ts";
import type { TelemetryOptions } from "./telemetry.ts";

export function telemetryScope(service: string, options: TelemetryOptions) {
  return Effect.acquireRelease(
    Effect.sync(() => initializeTelemetry(service, options)),
    (active, exit) =>
      Effect.promise(async () => {
        if (!active) {return;}
        const failed = Exit.isFailure(exit) && !Cause.hasInterruptsOnly(exit.cause);
        logEvent(
          failed ? "service_failed" : "stopped",
          { service, outcome: failed ? "failure" : "success" },
          failed ? "error" : "info",
        );
        logEvent("telemetry_stopping", { outcome: "success" });
        try {
          await active.close();
        } catch {
          logEvent("telemetry_shutdown_failed", { outcome: "failure" }, "error");
        }
      }),
  );
}
