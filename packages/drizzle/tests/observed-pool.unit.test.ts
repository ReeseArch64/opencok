import { afterEach, beforeEach, expect, mock, spyOn, test } from "bun:test";
import type { Pool, PoolClient } from "pg";
import { initializeLogging, withLogContext } from "@opencok/core/logging";
import { observePostgresPool } from "../src/observed-pool";

let records: Record<string, unknown>[];
let restore: (() => void)[];

beforeEach(() => {
    initializeLogging("pool-test");
    records = [];
    restore = ["log", "info", "warn", "error"].map((method) => {
        const spy = spyOn(console, method as "log").mockImplementation((value) =>
            records.push(JSON.parse(String(value)))
        );

        return () => spy.mockRestore();
    });
});

afterEach(() => restore.forEach((run) => run()));

test("connect_promise_preservesTheClientAndRecordsAcquisitionOutsideQueryExecution", async () => {
    const client = {} as PoolClient;
    const pool = {
        connect: mock(async () => client),
        waitingCount: 2,
        idleCount: 0,
        totalCount: 1,
    } as unknown as Pool;
    observePostgresPool(pool, "kingdom");

    const actual = await withLogContext({ requestId: "synthetic-request" }, () => pool.connect());

    expect(actual).toBe(client);
    expect(records.find((record) => record.event === "database_pool_acquired")).toMatchObject({
        operation: "postgresql.kingdom.pool_acquire",
        requestId: "synthetic-request",
        outcome: "success",
        waitingCount: 2,
        totalCount: 1,
    });
    expect(records.find((record) => record.event === "database_pool_acquired")?.durationMs)
        .toBeNumber();
});

test("connect_callback_preservesReleaseAndRecordsFailureWithoutRawMessages", () => {
    const failure = new Error("synthetic-private-connection-string");
    const release = mock(() => {});
    const pool = {
        connect: (callback: Parameters<Pool["connect"]>[0]) =>
            callback(failure, undefined, release),
        waitingCount: 0,
        idleCount: 0,
        totalCount: 0,
    } as unknown as Pool;
    observePostgresPool(pool, "global");
    const callback = mock<Parameters<Pool["connect"]>[0]>();

    pool.connect(callback);

    expect(callback).toHaveBeenCalledWith(failure, undefined, release);
    expect(records.find((record) => record.event === "database_pool_acquired")).toMatchObject({
        outcome: "failure",
        databaseRole: "global",
    });
    expect(JSON.stringify(records)).not.toContain(failure.message);
});

test("connect_rejectedPromise_preservesTheFailureAndDoesNotLogConnectionDetails", async () => {
    const failure = new Error("synthetic-sensitive-host");
    const pool = {
        connect: async () => {
            throw failure;
        },
        waitingCount: 0,
        idleCount: 0,
        totalCount: 0,
    } as unknown as Pool;
    observePostgresPool(pool, "kingdom");

    await expect(pool.connect()).rejects.toBe(failure);

    expect(records.filter((record) => record.event === "database_pool_acquired")).toHaveLength(1);
    expect(JSON.stringify(records)).not.toContain(failure.message);
});

test("connect_queuedCallback_retainsTheAcquiringRequestContext", () => {
    let acquired: Parameters<Pool["connect"]>[0] | undefined;
    const client = {} as PoolClient;
    const release = () => {};
    const pool = {
        connect: (callback: Parameters<Pool["connect"]>[0]) => {
            acquired = callback;
        },
        waitingCount: 0,
        idleCount: 0,
        totalCount: 1,
    } as unknown as Pool;
    observePostgresPool(pool, "kingdom");
    const callback = mock<Parameters<Pool["connect"]>[0]>();
    withLogContext({ requestId: "acquiring-request" }, () => pool.connect(callback));

    withLogContext({ requestId: "releasing-request" }, () => acquired!(undefined, client, release));

    expect(callback).toHaveBeenCalledWith(undefined, client, release);
    expect(records.find((record) => record.event === "database_pool_acquired")?.requestId)
        .toBe("acquiring-request");
});
