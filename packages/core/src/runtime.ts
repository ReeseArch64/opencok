import { BunRuntime } from "@effect/platform-bun";
import { Cause, Effect, Exit } from "effect";
import { initializeLogging, logEvent } from "./logging.ts";

export function runService<E>(name: string, program: Effect.Effect<unknown, E>) {
  initializeLogging(name);
  logEvent("starting", { service: name });
  BunRuntime.runMain(
    program.pipe(
      Effect.onExit((exit) =>
        Effect.sync(() => {
          if (Exit.isFailure(exit) && !Cause.hasInterruptsOnly(exit.cause)) {
            logEvent("service_failed", { service: name, outcome: "failure" }, "error");
          } else {
            logEvent("stopped", { service: name, outcome: "success" });
          }
        }),
      ),
    ),
    { disableErrorReporting: true },
  );
}
