import { BunRuntime } from "@effect/platform-bun";
import { Cause, Effect, Exit } from "effect";

export function runService<E>(name: string, program: Effect.Effect<unknown, E>) {
  BunRuntime.runMain(
    program.pipe(
      Effect.onExit((exit) =>
        Effect.sync(() => {
          if (Exit.isFailure(exit) && !Cause.hasInterruptsOnly(exit.cause)) {
            console.error(JSON.stringify({ event: "service_failed", service: name }));
          } else {
            console.info(JSON.stringify({ event: "stopped", service: name }));
          }
        }),
      ),
    ),
    { disableErrorReporting: true },
  );
}
