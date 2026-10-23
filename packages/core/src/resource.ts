import { Data, Effect } from "effect";

export class ResourceError extends Data.TaggedError("ResourceError")<{
  readonly operation: string;
}> {}

export function fromPromise<A>(operation: string, run: () => Promise<A>) {
  return Effect.tryPromise({ try: run, catch: () => new ResourceError({ operation }) });
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
