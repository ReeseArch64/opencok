import { expect, test } from "bun:test";
import { createServer, createConnection, type Socket } from "node:net";
import { createHash } from "node:crypto";
import { once } from "node:events";
import { createSessionHandler } from "@opencok/connection/session";
import type { ServerDependencies } from "@opencok/connection/dependencies";
import { FrameReader, frame } from "@opencok/messages/frame";
import { envelope, fields, sfs, str, type Fields } from "@opencok/messages/sfs";

async function harness(
    initialize: ServerDependencies["game"]["initialize"],
    authenticateWait: () => Promise<void> = async () => {},
    profileOpenWait: () => Promise<void> = async () => {},
)
{
    const claims = new Map<string, string>();
    const closed: string[] = [];
    const sockets = new Set<Socket>();
    const inFlight = new Set<Promise<void>>();
    const dependencies = {
        db: {
            getProfileById: async () => {
                await authenticateWait();

                return { uid: "synthetic", deviceUuid: "device", pf: "Google" };
            },
            getAccountsByPlayerId: async () => [{ active: 0, server: 1, uuid: "device" }],
        },
        cache: {
            claim: async (owner: string, token: string) => {
                if (claims.has(owner))
                {
                    return false;
                }
                claims.set(owner, token);
                return true;
            },
            release: async (owner: string, token: string) => {
                if (claims.get(owner) === token)
                {
                    claims.delete(owner);
                }
            },
            refresh: async () => true,
        },
        profileSessions: {
            open: profileOpenWait,
            close: async (_owner: string, session: string) => {
                closed.push(session);
            },
        },
        game: { initialize },
    } as unknown as ServerDependencies;
    const server = createServer(
        createSessionHandler(
            {
                host: "127.0.0.1",
                port: 0,
                healthPort: 0,
                kingdomId: 1,
                loginSecret: "synthetic-secret",
            },
            dependencies,
            {
                sockets,
                inFlight,
                metrics: { userId: 0, rejected: 0, commands: 0 },
                ready: () => true,
            },
        ),
    );
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address();
    if (!address || typeof address === "string")
    {
        throw new Error("Missing TCP address");
    }

    const connect = async () => {
        const accepted = once(server, "connection");
        const socket = createConnection(address.port, "127.0.0.1");
        const packets: Fields[] = [];
        const reader = new FrameReader();
        let login: (packet: Fields) => void = () => {};
        const loginResult = new Promise<Fields>((resolve) => {
            login = resolve;
        });
        let complete: () => void = () => {};
        const initialized = new Promise<void>((resolve) => {
            complete = resolve;
        });
        socket.on("data", (bytes) => {
            packets.push(...reader.feed(Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes)));
            const result = packets.find((packet) => packet.c?.value === 0 && packet.a?.value === 1);
            if (result)
            {
                login(result);
            }
            if (packets.some((packet) => str(fields(packet.p), "c", "") === "init"))
            {
                complete();
            }
        });
        await once(socket, "connect");
        socket.write(frame(envelope(0, 0, { api: sfs.string("1.7.0") })));
        socket.write(
            frame(
                envelope(0, 1, {
                    zn: sfs.string("COK1"),
                    un: sfs.string("synthetic"),
                    p: sfs.object({
                        gameUid: sfs.string("synthetic"),
                        cmdBaseTime: sfs.string("1"),
                        SecurityCode: sfs.string(
                            createHash("md5").update("1synthetic-secretsynthetic").digest("hex"),
                        ),
                        uuid: sfs.string("device"),
                        pf: sfs.string("Google"),
                        appVersion: sfs.string("12.06.0"),
                    }),
                }),
            ),
        );
        const [serverSocket] = await accepted;
        const disconnected = new Promise<void>((resolve) => serverSocket.once("close", resolve));

        return { socket, packets, initialized, loginResult, disconnected };
    };
    const close = async () => {
        const closing = [...sockets].map((socket) => {
            const closed = once(socket, "close");
            socket.destroy();

            return closed;
        });
        await Promise.all(closing);
        await new Promise<void>((resolve) => server.close(() => resolve()));
        while (inFlight.size)
        {
            await Promise.allSettled(inFlight);
        }
    };

    return { connect, close, claims, closed };
}

test("SFS login success precedes a complete supplied init payload within the synthetic 2s budget", async () => {
    const body = {
        playerInfo: sfs.object({ level: sfs.int(1) }),
        task: sfs.array(),
        marker: sfs.string("complete"),
    };
    const h = await harness(async () => ({ body, pushes: [] }));
    try
    {
        const started = performance.now();
        const client = await h.connect();
        await Promise.race([
            client.initialized,
            Bun.sleep(2000).then(() => {
                throw new Error("Synthetic login deadline exceeded");
            }),
        ]);
        expect(performance.now() - started).toBeLessThan(2000);
        expect(client.packets[1]?.a).toEqual(sfs.short(1));
        expect(fields(client.packets[1]?.p).rs).toEqual(sfs.short(0));
        expect(fields(fields(client.packets[2]?.p).p)).toEqual(body);
        client.socket.destroy();
    }
    finally
    {
        await h.close();
    }
    expect(h.claims.size).toBe(0);
    expect(h.closed).toHaveLength(1);
});

test("replacement aborts the abandoned initializer and retains only the new session claim", async () => {
    let entered: () => void = () => {};
    const initializing = new Promise<void>((resolve) => {
        entered = resolve;
    });
    let calls = 0;
    let aborted = false;
    const h = await harness(async (_owner, _details, signal) => {
        if (++calls === 1)
        {
            entered();
            await new Promise<void>((_resolve, reject) => {
                signal!.addEventListener(
                    "abort",
                    () => {
                        aborted = true;
                        reject(signal!.reason);
                    },
                    { once: true },
                );
            });
        }
        return { body: { marker: sfs.string("replacement") }, pushes: [] };
    });
    try
    {
        const previous = await h.connect();
        await initializing;
        const next = await h.connect();
        await Promise.race([
            next.initialized,
            Bun.sleep(2000).then(() => {
                throw new Error("Replacement deadline exceeded");
            }),
        ]);
        expect(aborted).toBe(true);
        expect(previous.packets).toHaveLength(1);
        expect(h.claims.size).toBe(1);
        next.socket.destroy();
        previous.socket.destroy();
    }
    finally
    {
        await h.close();
    }
    expect(h.claims.size).toBe(0);
    expect(h.closed).toHaveLength(2);
});

test.each([
    Object.assign(new Error("synthetic database failure"), { code: "57014" }),
    new Error("Query read timeout"),
    new Error("Connection terminated unexpectedly"),
])(
    "initialization failure %s releases its claim and permits a successful retry",
    async (failure) => {
        let calls = 0;
        const h = await harness(async () => {
            if (++calls === 1)
            {
                throw failure;
            }

            return { body: { marker: sfs.string("retry") }, pushes: [] };
        });
        try
        {
            const failed = await h.connect();
            const rejection = await Promise.race([
                failed.loginResult,
                Bun.sleep(2000).then(() => {
                    throw new Error("Failure response deadline exceeded");
                }),
            ]);
            expect(fields(rejection.p).ec).toEqual(sfs.short(3));
            expect(h.claims.size).toBe(0);
            expect(failed.packets).toHaveLength(2);
            failed.socket.destroy();
            const retry = await h.connect();
            await Promise.race([
                retry.initialized,
                Bun.sleep(2000).then(() => {
                    throw new Error("Retry deadline exceeded");
                }),
            ]);
            expect(h.claims.size).toBe(1);
            retry.socket.destroy();
        }
        finally
        {
            await h.close();
        }
        expect(h.claims.size).toBe(0);
        expect(h.closed).toHaveLength(2);
    },
);

test("replacement waits for an abandoned mutation to settle before initializing the next session", async () => {
    const entered = Promise.withResolvers<void>();
    const cancelled = Promise.withResolvers<void>();
    const mutation = Promise.withResolvers<void>();
    const actions: string[] = [];
    let calls = 0;
    const h = await harness(async (_owner, _details, signal) => {
        if (++calls === 1)
        {
            signal!.addEventListener("abort", () => cancelled.resolve(), { once: true });
            actions.push("previous-started");
            entered.resolve();
            await mutation.promise;
            actions.push("previous-settled");
            signal!.throwIfAborted();
        }

        actions.push("replacement-started");

        return { body: {}, pushes: [] };
    });

    try
    {
        const previous = await h.connect();
        await entered.promise;
        const previousToken = h.claims.get("synthetic");
        const replacement = await h.connect();
        await cancelled.promise;
        expect(actions).toEqual(["previous-started"]);
        expect(h.claims.get("synthetic")).toBe(previousToken);
        mutation.resolve();
        await replacement.initialized;
        expect(actions).toEqual([
            "previous-started",
            "previous-settled",
            "replacement-started",
        ]);
        expect(h.claims.size).toBe(1);
        expect(h.claims.get("synthetic")).not.toBe(previousToken);
        expect(previous.packets).toHaveLength(1);
    }
    finally
    {
        mutation.resolve();
        await h.close();
    }
});

test("disconnect during authentication prevents session claiming and initialization", async () => {
    const entered = Promise.withResolvers<void>();
    const authentication = Promise.withResolvers<void>();
    let initializations = 0;
    const h = await harness(async () => {
        initializations++;

        return { body: {}, pushes: [] };
    }, async () => {
        entered.resolve();
        await authentication.promise;
    });

    try
    {
        const client = await h.connect();
        await entered.promise;
        client.socket.destroy();
        await client.disconnected;
        authentication.resolve();
    }
    finally
    {
        authentication.resolve();
        await h.close();
    }

    expect(initializations).toBe(0);
    expect(h.claims.size).toBe(0);
    expect(h.closed).toHaveLength(0);
});

test("disconnect during profile-session opening prevents initialization and releases the claim", async () => {
    const entered = Promise.withResolvers<void>();
    const opening = Promise.withResolvers<void>();
    let initializations = 0;
    const h = await harness(
        async () => {
            initializations++;

            return { body: {}, pushes: [] };
        },
        async () => {},
        async () => {
            entered.resolve();
            await opening.promise;
        },
    );

    try
    {
        const client = await h.connect();
        await entered.promise;
        client.socket.destroy();
        await client.disconnected;
        opening.resolve();
    }
    finally
    {
        opening.resolve();
        await h.close();
    }

    expect(initializations).toBe(0);
    expect(h.claims.size).toBe(0);
    expect(h.closed).toHaveLength(1);
});
