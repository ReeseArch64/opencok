import { expect, test } from "bun:test";
import { Effect, Fiber } from "effect";
import { serveHttp } from "../src/http";

test("Effect HTTP listener preserves fetch bodies and closes its port with the scope", async () => {
    let port = 0;
    await Effect.runPromise(
        Effect.scoped(
            Effect.gen(function*()
            {
                const server = yield* serveHttp(
                    { host: "127.0.0.1", port: 0 },
                    async (request) =>
                        new Response(await request.text(), {
                            status: 201,
                            headers: { "X-Test": "preserved" },
                        }),
                );
                port = server.port;
                const response = yield* Effect.promise(() =>
                    fetch(`http://127.0.0.1:${port}/`, {
                        method: "POST",
                        body: "payload",
                        headers: { Connection: "close" },
                    })
                );
                expect(response.status).toBe(201);
                expect(response.headers.get("X-Test")).toBe("preserved");
                expect(yield* Effect.promise(() => response.text())).toBe("payload");
            }),
        ),
    );
    await expect(fetch(`http://127.0.0.1:${port}/`)).rejects.toThrow();
});

test("shutdown waits for an active Promise handler before releasing its dependencies", async () => {
    let completeRequest!: () => void;
    const gate = new Promise<void>((resolve) => {
        completeRequest = resolve;
    });
    let markStarted!: () => void;
    const started = new Promise<void>((resolve) => {
        markStarted = resolve;
    });
    let markListening!: (port: number) => void;
    const listening = new Promise<number>((resolve) => {
        markListening = resolve;
    });
    let handled = false;
    let released = false;
    const fiber = Effect.runFork(
        Effect.scoped(
            Effect.gen(function*()
            {
                yield* Effect.addFinalizer(() =>
                    Effect.sync(() => {
                        expect(handled).toBe(true);
                        released = true;
                    })
                );
                const server = yield* serveHttp({ host: "127.0.0.1", port: 0 }, async () => {
                    markStarted();
                    await gate;
                    handled = true;
                    return new Response("finished");
                });
                markListening(server.port);
                yield* Effect.never;
            }),
        ),
    );
    const port = await listening;
    const response = fetch(`http://127.0.0.1:${port}/`);
    await started;
    const stopped = Effect.runPromise(Fiber.interrupt(fiber));
    expect(released).toBe(false);
    completeRequest();
    expect(await (await response).text()).toBe("finished");
    await stopped;
    expect(released).toBe(true);
});
