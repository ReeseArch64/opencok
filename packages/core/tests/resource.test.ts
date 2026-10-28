import { expect, test } from "bun:test";
import { Deferred, Effect, Exit, Fiber } from "effect";
import { acquireResource, fromPromise } from "../src/resource";

test("dependent startup failure releases previously acquired resources in reverse order", async () => {
    const closed: string[] = [];
    const resource = (name: string) =>
        acquireResource(
            name,
            async () => name,
            async () => {
                closed.push(name);
            },
        );
    await Effect.runPromiseExit(
        Effect.scoped(
            Effect.gen(function*()
            {
                yield* resource("database");
                yield* resource("listener");
                yield* fromPromise("startup", async () => {
                    throw new Error("secret");
                });
            }),
        ),
    );
    expect(closed).toEqual(["listener", "database"]);
});

test("interruption during acquisition waits for ownership and releases exactly once", async () => {
    let releaseAcquisition!: () => void;
    const acquisition = new Promise<void>((resolve) => {
        releaseAcquisition = resolve;
    });
    let closeCount = 0;
    const started = Deferred.makeUnsafe<void>();
    const program = Effect.scoped(
        Effect.gen(function*()
        {
            yield* acquireResource(
                "slow",
                async () => {
                    Deferred.doneUnsafe(started, Exit.succeed(undefined));
                    await acquisition;
                    return 1;
                },
                async () => {
                    closeCount++;
                },
            );
            yield* Effect.never;
        }),
    );
    const fiber = Effect.runFork(program);
    await Effect.runPromise(Deferred.await(started));
    const interrupted = Effect.runPromise(Fiber.interrupt(fiber));
    releaseAcquisition();
    await interrupted;
    expect(closeCount).toBe(1);
});
