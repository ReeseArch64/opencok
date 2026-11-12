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
    "public migration and seed commands support safe replay and preserve world constraints",
    async () => {
        await databases.runScript("migrate");
        await databases.runScript("seed");
        await databases.runScript("migrate");
        await databases.runScript("seed");
        const output = await databases.runCheck("world-structure");
        expect(output).toContain("database checks passed");
        expect(output).toContain("MongoDB validation, concurrency and transfer checks passed");
        expect(await databases.runCheck("schema")).toContain(
            "Full global and kingdom schema checks passed",
        );
    },
    120_000,
);

test(
    "construction persistence protects receipts, costs, rollback and migration recovery",
    async () => {
        const output = await databases.runCheck("construction");
        expect(output).toContain("passed");
    },
    120_000,
);

test("training persistence preserves queue, balances and configuration constraints", async () => {
    const output = await databases.runCheck("training");
    expect(output).toContain("passed");
}, 120_000);

test("gathering persistence preserves marches, deposits and reward constraints", async () => {
    const output = await databases.runCheck("basic-gathering");
    expect(output).toContain("passed");
}, 120_000);
