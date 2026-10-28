import { expect, test } from "bun:test";
import type { WorldResourceRefreshStore } from "@opencok/world/contracts/world-resource-refresh";
import type { WorldResourceNewStore } from "@opencok/world/contracts/world-resource-new";
import { Rules } from "@opencok/rules/game";
import {
    createRealmWorldResourceNewService,
    createRealmWorldResourceRefreshService,
    createRealmWorldMonsterRefreshService,
} from "../src/composition/world-population";
import { WorldPopulationJob } from "../src/world-population-job.ts";

function services()
{
    const rules = new Rules(new Map(), new Map(), new Map());
    return {
        shared: createRealmWorldResourceNewService(rules, 1201),
        resources: createRealmWorldResourceRefreshService(rules, 1201),
        monsters: createRealmWorldMonsterRefreshService(rules, 1201),
    };
}

function idleResources(): WorldResourceRefreshStore
{
    return {
        now: 2n,
        opening: 1n,
        goldBonusUntil: 0n,
        clock: {
            worldId: 0,
            groupStartedAt: 1n,
            usedGroups: "",
            areaCursor: 0,
            nextRefreshAt: 3n,
        },
        expired: async () => [],
        pending: async () => [],
        population: async () => 0,
        free: async () => undefined,
        postpone: async () => {},
        clear: async () => {},
        ticket: async () => {},
        retry: async () => {},
        removeTicket: async () => {},
        spawn: async () => {},
        save: async () => {},
    };
}

test("population recovery waits for each executor and leaves timestamp capture to it", async () => {
    const calls: string[] = [];
    const entered = Promise.withResolvers<void>();
    const release = Promise.withResolvers<void>();
    const job = new WorldPopulationJob(
        {
            async execute(at)
            {
                expect(at).toBeUndefined();
                calls.push("shared");
                entered.resolve();
                await release.promise;
                calls.push("shared-complete");
            },
        },
        {
            async execute(at)
            {
                expect(at).toBeUndefined();
                expect(calls).toEqual(["shared", "shared-complete"]);
                calls.push("resources");
                await Promise.resolve();
                calls.push("resources-complete");
            },
        },
        {
            async execute(at)
            {
                expect(at).toBeUndefined();
                calls.push("monsters");
            },
        },
        services(),
        async () => new Map(),
        (event) => calls.push(event),
    );
    const running = job.run();
    await entered.promise;
    expect(calls).toEqual(["shared"]);
    release.resolve();
    await running;
    expect(calls).toEqual([
        "shared",
        "shared-complete",
        "resources",
        "resources-complete",
        "monsters",
    ]);
});

for (let failures = 0; failures < 8; failures++)
{
    test(`population failure combination ${failures} preserves later families and next iteration`, async () => {
        const calls: number[] = [];
        const reports: string[] = [];
        let failing = true;
        const executor = (family: number) => ({
            async execute()
            {
                calls.push(family);

                if (failing && (failures & (1 << family)))
                {
                    throw new Error("Synthetic executor failure");
                }
            },
        });
        const job = new WorldPopulationJob(
            executor(0),
            executor(1),
            executor(2),
            services(),
            async () => new Map(),
            (event) => reports.push(event),
        );
        await job.run();
        expect(calls).toEqual([0, 1, 2]);
        expect(reports).toEqual([
            "world_shared_resource_recovery_failed",
            "world_resource_recovery_failed",
            "world_monster_recovery_failed",
        ].filter((_, family) => failures & (1 << family)));
        failing = false;
        calls.length = 0;
        reports.length = 0;
        await job.run();
        expect(calls).toEqual([0, 1, 2]);
        expect(reports).toEqual([]);
    });
}

test("resource effects are loaded inside the executor callback and failures preserve monster recovery", async () => {
    let inside = false;
    let failEffects = true;
    let effectReads = 0;
    let monsterRuns = 0;
    const reports: string[] = [];
    const job = new WorldPopulationJob(
        { execute: async () => {} },
        {
            async execute(at, work)
            {
                expect(at).toBeUndefined();
                inside = true;

                try
                {
                    await work(idleResources());
                }
                finally
                {
                    inside = false;
                }
            },
        },
        {
            execute: async () => {
                monsterRuns++;
            },
        },
        services(),
        async () => {
            expect(inside).toBe(true);
            effectReads++;

            if (failEffects)
            {
                throw new Error("Synthetic effect lookup failure");
            }

            return new Map();
        },
        (event) => reports.push(event),
    );
    await job.run();
    expect(reports).toEqual(["world_resource_recovery_failed"]);
    failEffects = false;
    await job.run();
    expect(effectReads).toBe(2);
    expect(monsterRuns).toBe(2);
    expect(reports).toHaveLength(1);
    expect(inside).toBe(false);
});

test("a reused population service observes replacement catalog settings while retaining occupied footprints", async () => {
    const rules = new Rules(new Map(), new Map(), new Map());
    rules.items.set("worldmap_city", { k6: "5" });
    rules.items.set("on_event2", { k1: "0", k2: "1000", k8: "3600" });
    const service = createRealmWorldResourceNewService(rules, 5);
    const deadlines: bigint[] = [];
    const unexpected = async () => {
        throw new Error("Occupied footprint must not be cleared, funded or replaced");
    };
    const store: WorldResourceNewStore = {
        now: 1000n,
        clock: undefined,
        expired: async () => [{ id: 7, flushTime: 100n }],
        occupied: async () => true,
        postpone: async (point, deadline) => {
            expect(point.id).toBe(7);
            deadlines.push(deadline);
        },
        clear: unexpected,
        clearOrphans: async () => 0,
        pending: async () => [],
        population: unexpected,
        ticket: unexpected,
        retry: unexpected,
        removeTicket: unexpected,
        spawn: unexpected,
        save: async () => {},
    };
    await service.refresh(store);
    rules.items.set("on_event2", { k1: "0", k2: "1000", k8: "7200" });
    await service.refresh(store);
    expect(deadlines).toEqual([3600100n, 7200100n]);
});
