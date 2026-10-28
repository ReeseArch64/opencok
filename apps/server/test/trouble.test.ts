import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { temporaryEffect } from "@opencok/rules/player-effects";
import { troubleItem, troubleRemovalGold } from "@opencok/rules/trouble";
import {
    reserveMarch,
    arriveForGathering,
    accelerateMarch,
    recallOutbound,
    completeMarchReturn,
} from "@opencok/rules/world-march-lifecycle";
import { createRealmGameService } from "../src/composition/game";
import type { GameStore } from "@opencok/contracts/game";
import { sfs } from "@opencok/messages/sfs";
test("opposing trouble durations subtract until the existing status is exhausted, then replace it", async () => {
    const rules = await loadRules();
    rules.power.statuses!.set("900001", {
        ...rules.power.statuses!.get("500586")!,
        id: "900001",
        overlap: "4",
        time: "60",
    });
    const original = temporaryEffect([], rules, "owner", "500586", 1000n, 1, () => 0).states[0]!;
    const reduced = temporaryEffect([original], rules, "owner", "900001", 2000n, 1, () => 0);
    expect(reduced.states[0]).toMatchObject({
        stateId: 500586,
        startTime: 1000n,
        endTime: 241000n,
    });
    expect(reduced.deleted).toEqual([]);
    const replaced = temporaryEffect(
        [{ ...original, endTime: 62000n }],
        rules,
        "owner",
        "900001",
        2000n,
        1,
        () => 0,
    );
    expect(replaced.states[0]).toMatchObject({
        stateId: 900001,
        startTime: 2000n,
        endTime: 62000n,
    });
    expect(replaced.deleted).toEqual([500586]);
    expect(
        temporaryEffect([original], rules, "owner", "500586", 2000n, 1, () => 0).states[0]!.endTime,
    ).toBe(601000n);
    expect(troubleItem(rules, "210097").id).toBe("500586");
    expect(() => troubleItem(rules, "200001")).toThrow();
    expect(troubleRemovalGold(rules, 1000n, 2000n)).toBe(0n);
    expect(troubleRemovalGold(rules, 2000n, 1001n)).toBe(0n);
    expect(troubleRemovalGold(rules, 9223372036854775807n, 0n)).toBeGreaterThan(0n);
});
test("only an explicit trouble march permits no troops and it cannot gather cargo", () => {
    const input = {
        id: "march",
        owner: "owner",
        worldId: 0,
        origin: 1,
        target: 10,
        startedAt: 1000n,
        dueAt: 11000n,
        returnDuration: 10000n,
        troops: [],
    };
    expect(() => reserveMarch(input, [])).toThrow();
    const start = reserveMarch({ ...input, purpose: "trouble" }, []);
    expect(start.troops).toEqual([]);
    expect(() => arriveForGathering(start.march, "owner", 1, 11000n, 1000n)).toThrow();
    const sped = accelerateMarch(start.march, "owner", 1, 2000n, 50).march;
    expect(sped.dueAt).toBe(6500n);
    const returning = recallOutbound(sped, "owner", 2, 2000n, 1000n).march;
    const completed = completeMarchReturn(returning, "owner", 3, 3000n, []);
    expect(completed.credit).toBeNull();
    expect(completed.march.phase).toBe("completed");
    expect(() =>
        accelerateMarch(
            { ...start.march, cargo: { resource: "wood", amount: 1n } },
            "owner",
            1,
            2000n,
            50,
        )
    ).toThrow();
});
test("trouble native commands retain long correlation and reject forged arrival producers", async () => {
    const rules = await loadRules(),
        game = createRealmGameService({} as GameStore, rules, { kingdomId: 1 }, () => 1000, {
            cityProgression: async () => ({ body: {}, pushes: [] }),
        });
    for (const command of ["get.trouble.list", "trouble.speed"])
    {
        expect(
            (await game.execute("owner", command, { _cok_: sfs.long(9007199254740993n) })).body
                ._cok_,
        ).toEqual(sfs.long(9007199254740993n));
    }
    await expect(
        game.execute("owner", "trouble.deliver", {
            item: sfs.string("210097"),
            sender: sfs.string("owner"),
        }),
    ).rejects.toThrow();
});
