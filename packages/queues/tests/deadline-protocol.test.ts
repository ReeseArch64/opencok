import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import type {
    ActivityDeadlineDispatcher,
    DeadlineRequest,
    DueActivitySnapshot,
} from "../src/contracts/deadline";
import { activityDeadlinePath } from "../src/contracts/deadline";
import { ActivityDispatchResult } from "../src/enums/dispatch-result";
import { DeadlineOperation } from "../src/enums/deadline-operation";
import { ActivityDeadlineMapper } from "../src/mappings/deadline";
import { ActivityOperationMapper } from "../src/mappings/operation-id";
import { signActivityDeadline, verifyActivityDeadline } from "../src/identity/deadline";
import { ActivityDeadlineController } from "../src/controllers/deadline";
import { createActivityDeadlinePublisher } from "../src/connection/deadline";

const mapper = new ActivityDeadlineMapper();
const operationIds = new ActivityOperationMapper();

const secret = "synthetic-scheduler-realm-one-key-32";
const otherSecret = "synthetic-scheduler-realm-two-key-32";
const due: DueActivitySnapshot = {
    id: "activity",
    ownerId: "owner",
    queueId: "queue",
    type: 0,
    dueAt: 9007199254740993n,
    version: 7,
};
const envelope = () => ({ contractVersion: 1 as const, kingdomId: 1, requestId: randomUUID() });
const dispatcher: ActivityDeadlineDispatcher = {
    capabilities: async () => [0, 6, 19],
    restore: async () => ActivityDispatchResult.Applied,
    finish: async () => ActivityDispatchResult.Applied,
};

function request(command: DeadlineRequest, key = secret, timestamp = String(Date.now())): Request
{
    const body = mapper.encodeRequest(command);

    return new Request(`http://localhost${activityDeadlinePath}`, {
        method: "POST",
        body,
        headers: {
            "content-type": "application/json",
            "x-activity-time": timestamp,
            "x-activity-signature": signActivityDeadline(body, timestamp, key),
        },
    });
}

test("deadline wire keeps exact bigint snapshots, null legacy identity and closed versioned shapes", () => {
    const finish: DeadlineRequest = {
        ...envelope(),
        operation: DeadlineOperation.Finish,
        snapshot: due,
    };
    expect(mapper.decodeRequest(mapper.encodeRequest(finish))).toEqual(finish);
    const legacy = {
        uuid: "old",
        ownerId: "owner",
        type: 0,
        itemId: "item",
        startTime: 11n,
        updateTime: 22n,
    };
    expect(operationIds.restore(legacy)).toBe(
        "restore:58648e466982e8ffcc21c1fbe51a512fe7595165fd3e78e93cbecd65988c6d12",
    );
    const restore: DeadlineRequest = {
        ...envelope(),
        operation: DeadlineOperation.Restore,
        snapshot: { ...legacy, startTime: null },
    };
    expect(mapper.decodeRequest(mapper.encodeRequest(restore))).toEqual(restore);
    expect(operationIds.restore(restore.snapshot)).not.toBe(
        operationIds.restore({ ...legacy, startTime: 0n }),
    );
    const valid = JSON.parse(mapper.encodeRequest(finish));
    for (
        const changed of [
            { ...valid, contractVersion: 2 },
            { ...valid, kingdomId: 0 },
            { ...valid, extra: true },
            { ...valid, snapshot: { ...valid.snapshot, dueAt: Number(due.dueAt) } },
            { ...valid, snapshot: { ...valid.snapshot, dueAt: "01" } },
            { ...valid, snapshot: { ...valid.snapshot, dueAt: "9223372036854775807" } },
            { ...valid, snapshot: { ...valid.snapshot, version: 0 } },
            { ...valid, snapshot: { ...valid.snapshot, type: 42 } },
            { ...valid, snapshot: { ...valid.snapshot, arbitraryCommand: "grant" } },
        ]
    )
    {
        expect(() => mapper.decodeRequest(JSON.stringify(changed))).toThrow();
    }
});

test("deadline signature binds body, direction, time and dedicated realm key", () => {
    const body = mapper.encodeRequest({
        ...envelope(),
        operation: DeadlineOperation.Finish,
        snapshot: due,
    });
    const now = Date.now();
    const timestamp = String(now);
    const signature = signActivityDeadline(body, timestamp, secret);
    expect(verifyActivityDeadline(body, timestamp, signature, secret, now)).toBe(true);
    expect(verifyActivityDeadline(body, timestamp, signature, otherSecret, now)).toBe(false);
    expect(verifyActivityDeadline(body, timestamp, signature, secret, now, true)).toBe(false);
    expect(verifyActivityDeadline(body + " ", timestamp, signature, secret, now)).toBe(false);
    expect(verifyActivityDeadline(body, timestamp, signature, secret, now + 30001)).toBe(false);
    expect(verifyActivityDeadline(body, timestamp, "invalid", secret, now)).toBe(false);
});

test("owner endpoint rejects wrong realm, unsupported shape and foreign key before dispatch", async () => {
    let calls = 0;
    const endpoint = new ActivityDeadlineController({
        kingdomId: 1,
        signingSecret: secret,
        ready: () => true,
        dispatcher: {
            ...dispatcher,
            finish: async () => {
                calls++;
                return ActivityDispatchResult.Obsolete;
            },
        },
    });
    try
    {
        const command: DeadlineRequest = {
            ...envelope(),
            operation: DeadlineOperation.Finish,
            snapshot: due,
        };
        expect((await endpoint.handle(request(command, otherSecret))).status).toBe(401);
        expect((await endpoint.handle(request({ ...command, kingdomId: 2 }))).status).toBe(403);
        expect(calls).toBe(0);
        const response = await endpoint.handle(request(command));
        const body = await response.text();
        expect(response.status).toBe(200);
        expect(
            verifyActivityDeadline(
                body,
                response.headers.get("x-activity-time"),
                response.headers.get("x-activity-signature"),
                secret,
                Date.now(),
                true,
            ),
        ).toBe(true);
        expect(mapper.decodeResponse(body)).toEqual({
            ...envelope(),
            requestId: command.requestId,
            operation: DeadlineOperation.Finish,
            result: ActivityDispatchResult.Obsolete,
        });
        expect(calls).toBe(1);
        expect(
            (await endpoint.handle(
                new Request(`http://localhost${activityDeadlinePath}`, {
                    method: "POST",
                    body: "x",
                    headers: { "content-type": "application/json", "content-length": "4097" },
                }),
            )).status,
        ).toBe(413);
    }
    finally
    {
        await endpoint.close();
    }
});

test("timed-out owner operations retain admission and drain until the actual mutation settles", async () => {
    const entered = Promise.withResolvers<void>();
    const finish = Promise.withResolvers<ActivityDispatchResult>();
    let calls = 0;
    const endpoint = new ActivityDeadlineController({
        kingdomId: 1,
        signingSecret: secret,
        ready: () => true,
        timeoutMs: 100,
        maxConcurrent: 1,
        dispatcher: {
            ...dispatcher,
            finish: async () => {
                calls++;
                entered.resolve();
                return finish.promise;
            },
        },
    });
    const command: DeadlineRequest = {
        ...envelope(),
        operation: DeadlineOperation.Finish,
        snapshot: due,
    };
    const pending = endpoint.handle(request(command));
    await entered.promise;
    expect((await pending).status).toBe(503);
    expect((await endpoint.handle(request(command))).status).toBe(429);
    let closed = false;
    const closing = endpoint.close().then(() => {
        closed = true;
    });
    await Promise.resolve();
    expect(closed).toBe(false);
    expect((await endpoint.handle(request(command))).status).toBe(503);
    finish.resolve(ActivityDispatchResult.Applied);
    await closing;
    expect(closed).toBe(true);
    expect(calls).toBe(1);
});

test("publisher verifies signed response correlation and bounds stalled response bodies", async () => {
    let corrupt = false;
    let stall = false;
    const endpoint = new ActivityDeadlineController({
        kingdomId: 1,
        signingSecret: secret,
        ready: () => true,
        dispatcher,
    });
    const server = Bun.serve({
        hostname: "127.0.0.1",
        port: 0,
        fetch: async (incoming) => {
            if (stall)
            {
                return new Response(
                    new ReadableStream({
                        start()
                        {},
                    }),
                );
            }
            if (corrupt)
            {
                const command = mapper.decodeRequest(await incoming.text());
                const body = mapper.encodeResponse({
                    ...envelope(),
                    kingdomId: command.kingdomId,
                    operation: DeadlineOperation.Capabilities,
                    types: [0],
                });
                const timestamp = String(Date.now());
                return new Response(body, {
                    headers: {
                        "x-activity-time": timestamp,
                        "x-activity-signature": signActivityDeadline(body, timestamp, secret, true),
                    },
                });
            }
            return endpoint.handle(incoming);
        },
    });
    try
    {
        const publisher = createActivityDeadlinePublisher({
            url: `http://127.0.0.1:${server.port}${activityDeadlinePath}`,
            kingdomId: 1,
            signingSecret: secret,
            timeoutMs: 100,
        });
        expect(await publisher.capabilities()).toEqual([0, 6, 19]);
        expect(await publisher.finish(due)).toBe(ActivityDispatchResult.Applied);
        corrupt = true;
        await expect(publisher.capabilities()).rejects.toThrow("Activity owner unavailable");
        stall = true;
        await expect(publisher.capabilities()).rejects.toThrow("Activity owner unavailable");
    }
    finally
    {
        server.stop(true);
        await endpoint.close();
    }
});
