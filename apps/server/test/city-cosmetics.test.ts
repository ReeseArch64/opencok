import { test, expect } from "bun:test";
import { temporaryEffect } from "@opencok/rules/player-effects";
import { createRealmCosmeticPolicy } from "../src/composition/skins";

import { cosmeticInteractionParticipants } from "../src/composition/skins";
import { loadRules } from "@opencok/resources/rules";
import { sfs } from "@opencok/messages/sfs";

const { cityCosmeticProjection } = createRealmCosmeticPolicy();

test("city cosmetic projection prioritizes temporary trouble effects and retains Java signed seconds", async () => {
    const rules = await loadRules();
    const rows = [
        { stateId: 509878, type2: 100, endTime: 2147483648000n, count: 1 },
        { stateId: 500586, type2: 100, endTime: 2147483649000n, count: 1 },
        { stateId: 509877, type2: 200, endTime: 2147483648000n, count: 50 },
    ];
    const view = cityCosmeticProjection(rows, rules, 1000n);
    expect(view.sid).toBe(500586);
    expect(view.set).toBe(-2147483647);
    expect(view.overlap).toEqual({ sid: 509877, set: -2147483648, count: 50 });
    expect(cityCosmeticProjection(rows, rules, 2147483649000n)).toEqual({});
});
test("cosmetic mutations request ordered multi-account locks through an authoritative participant selection", () => {
    expect(
        cosmeticInteractionParticipants("owner", "trigger.activity", {
            type: sfs.int(45),
            uid: sfs.string("other"),
        }),
    ).toEqual(["owner", "other"]);
    expect(
        cosmeticInteractionParticipants("owner", "trigger.activity", {
            type: sfs.int(45),
            uid: sfs.string("owner"),
        }),
    ).toEqual(["owner"]);
    expect(
        cosmeticInteractionParticipants("owner", "trigger.activity", {
            type: sfs.int(45),
            uid: sfs.string(""),
        }),
    ).toBeUndefined();
    expect(
        cosmeticInteractionParticipants("owner", "unrelated", {
            type: sfs.int(45),
            uid: sfs.string("other"),
        }),
    ).toBeUndefined();
});

test("modern cosmetic subgroups replace a different appearance while retaining matching subgroup semantics", async () => {
    const rules = await loadRules();
    rules.power.statuses!.set("990001", {
        id: "990001",
        type2: "100",
        time: "10",
        overlap: "2",
        group: "500500",
        subgroup: "1",
    });
    rules.power.statuses!.set("990002", {
        id: "990002",
        type2: "100",
        time: "10",
        overlap: "2",
        group: "500500",
        subgroup: "2",
    });
    const first = temporaryEffect([], rules, "owner", "990001", 1000n, 1, () => 0);
    const second = temporaryEffect(first.states, rules, "owner", "990002", 2000n, 1, () => 0);
    expect(second.deleted).toEqual([990001]);
    expect(second.states[0]!).toMatchObject({ stateId: 990002, startTime: 2000n, endTime: 12000n });
});
