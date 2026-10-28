import { expect, test } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { characterSeed } from "@opencok/player/rules/character-seed";
import type { CharacterReservation } from "@opencok/contracts/provisioning";

const reservation: CharacterReservation = {
    identityId: "00000000-0000-4000-8000-000000000001",
    gameUid: "123456",
    name: "Lord123456",
    kingdomId: 1,
    deviceUuid: "synthetic",
    country: "BR",
    language: "pt",
    createdAt: 1800000000000,
    preset: "normal-v1",
};

test("normal starter overrides accelerated balances and creates playable level-one progression", async () => {
    const rules = await loadRules();
    const seed = characterSeed(reservation, rules);
    expect(seed.profile).toMatchObject({ level: 1, exp: 0, gold: 1000n, crystal: 0n });
    expect(seed.resource).toMatchObject({
        wood: 100000n,
        food: 100000n,
        stone: 0n,
        iron: 0n,
        silver: 0,
    });
    expect(seed.buildings).toHaveLength(11);
    expect(seed.buildings.every((row) => row.level === 1 && row.star === 0)).toBe(true);
    expect(seed.queues).toHaveLength(7);
    expect(seed.tasks).toHaveLength(9);
    expect(seed.tasks.find((row) => row.id === "2300102")).toMatchObject({ state: 0, num: 1 });
    expect(seed.tasks.find((row) => row.id === "2100101")).toMatchObject({ state: 1, num: 1 });
    expect(seed.shieldEnd).toBe(BigInt(reservation.createdAt) + 259200000n);
    expect(seed.vip).toMatchObject({ level: 0, vipEndTime: 0n });
    expect(seed.generals).toHaveLength(1);
    expect(() => characterSeed({ ...reservation, preset: "accelerated" }, rules)).toThrow();
    expect(() => characterSeed({ ...reservation, kingdomId: 2 }, rules)).toThrow();
    rules.positions.clear();
    expect(() => characterSeed(reservation, rules)).toThrow("Incomplete");
});
