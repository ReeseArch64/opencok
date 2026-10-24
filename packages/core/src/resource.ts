import { Data, Effect } from "effect";
import { errorReason, logEvent } from "./logging.ts";

export class ResourceError extends Data.TaggedError("ResourceError")<{
  readonly operation: string;
}> {}

export function fromPromise<A>(operation: string, run: () => Promise<A>) {
  return Effect.tryPromise({
    try: async () => {
      const started = performance.now();
      try {
        const result = await run();
        if (operation !== "realm.health")
          logEvent("resource_completed", {
            operation,
            outcome: "success",
            durationMs: Math.round(performance.now() - started),
          });
        return result;
      } catch (error) {
        logEvent(
          "resource_failed",
          {
            reason: errorReason(error),
            operation,
            outcome: "failure",
            durationMs: Math.round(performance.now() - started),
          },
          "error",
        );
        throw new ResourceError({ operation });
      }
    },
    catch: () => new ResourceError({ operation }),
  });
}

export function acquireResource<A>(
  operation: string,
  acquire: () => Promise<A>,
  release: (resource: A) => Promise<unknown>,
) {
  return Effect.acquireRelease(fromPromise(operation, acquire), (resource) =>
    fromPromise(`${operation}.close`, () => release(resource)).pipe(Effect.orDie),
  );
}
