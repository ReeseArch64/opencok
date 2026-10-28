import { expect, test } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { createInventoryRuntime } from "@opencok/services/inventory-runtime";
import type { InventoryState } from "@opencok/contracts/inventory";
import { cityFixture } from "./fixtures/city-progression";

const rules = await loadRules();

test("inventory runtime reads snapshot, world and emperor in order without changing the snapshot", async () => {
    const { state: city } = cityFixture(rules);
    const calls: string[] = [];
    const state: InventoryState = {
        profile: city.profile,
        resource: city.resource,
        items: [],
        buildings: city.buildings,
        cooldowns: new Map(),
        effects: async () => {
            calls.push("snapshot");
            return city.effects;
        },
    };
    const runtime = createInventoryRuntime({
        world: async () => {
            calls.push("world");
            return new Map([[101, 12.5]]);
        },
        emperor: async () => {
            calls.push("emperor");
            return null;
        },
    });
    expect(await runtime.resourceBonus(state, rules, 1000000, 101)).toBe(12.5);
    expect(calls).toEqual(["snapshot", "world", "emperor"]);
    expect(Object.hasOwn(city.effects.profile, "decomposeSuitEffect")).toBe(false);
    calls.length = 0;
    state.effects = async () => {
        calls.push("snapshot");
        throw new Error("Snapshot unavailable");
    };
    await expect(runtime.resourceBonus(state, rules, 1000000, 101)).rejects.toThrow(
        "Snapshot unavailable",
    );
    expect(calls).toEqual(["snapshot"]);
});

test("inventory runtime propagates world failure before consulting the emperor", async () => {
    const { state: city } = cityFixture(rules);
    let emperorReads = 0;
    const runtime = createInventoryRuntime({
        world: async () => {
            throw new Error("World unavailable");
        },
        emperor: async () => {
            emperorReads++;
            return null;
        },
    });
    await expect(runtime.resourceBonus(
        {
            profile: city.profile,
            resource: city.resource,
            items: [],
            buildings: city.buildings,
            cooldowns: new Map(),
            effects: async () => city.effects,
        },
        rules,
        1000000,
        101,
    )).rejects.toThrow("World unavailable");
    expect(emperorReads).toBe(0);
});
