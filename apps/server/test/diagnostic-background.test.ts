import { expect, test } from "bun:test";
import { Deferred, Effect } from "effect";
import { realmBackground } from "../src/composition/background";
import { createRealmMailIntegrationWorker } from "../src/composition/mail-integration";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

test("diagnostic background never starts suspended recovery work", async () => {
    let calls = 0;
    await Effect.runPromise(Effect.scoped(Effect.gen(function*()
    {
        yield* Effect.sync(() => {
            calls++;
        }).pipe(realmBackground(true));
        yield* Effect.yieldNow;
    })));
    expect(calls).toBe(0);
});

test("normal background runs recovery and stops it with the service scope", async () => {
    let stopped = false;
    await Effect.runPromise(Effect.scoped(Effect.gen(function*()
    {
        const started = yield* Deferred.make<void>();
        yield* Effect.acquireUseRelease(
            Deferred.succeed(started, undefined),
            () => Effect.never,
            () =>
                Effect.sync(() => {
                    stopped = true;
                }),
        ).pipe(realmBackground(false));
        yield* Deferred.await(started);
    })));
    expect(stopped).toBe(true);
});

test("diagnostic mode does not construct the in-process mail worker", () => {
    const unused = new Proxy({}, {
        get()
        {
            throw new Error("Unexpected diagnostic mail access");
        },
    });
    expect(createRealmMailIntegrationWorker(
        { diagnosticLogin: true, kingdomId: 1, timeoutMs: 1000 },
        unused as DatabaseClient<"kingdom">,
        unused as DatabaseClient<"global">,
    )).toBeUndefined();
});
