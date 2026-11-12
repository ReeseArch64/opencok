import { afterAll, beforeAll, expect, test } from "vitest";
import { startDatabases } from "../support/database";

let databases: Awaited<ReturnType<typeof startDatabases>>;

beforeAll(async () => {
    databases = await startDatabases();
}, 180_000);

afterAll(async () => {
    await databases?.stop();
}, 60_000);

test(
    "real repositories preserve database isolation, cache consistency and concurrency",
    async () => {
        const output = await databases.runCheck("repositories");
        expect(output).toContain("passed");
    },
    120_000,
);

test("Redis status migration preserves TTL, retry and rollback semantics", async () => {
    const output = await databases.runCheck("redis-status");
    expect(output).toContain("passed");
}, 120_000);

test("kingdom rule migrations preserve versioning and authority constraints", async () => {
    const output = await databases.runCheck("kingdom-rules");
    expect(output).toContain("passed");
}, 120_000);
