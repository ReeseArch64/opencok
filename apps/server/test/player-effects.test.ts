import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { temporaryEffect, vipMutation } from "@opencok/rules/player-effects";
import { validateTalentTrees } from "@opencok/hero/rules/legacy-general-talents";
import { storedPowerEffects } from "@opencok/rules/power-effects";
import { applyProgressionStatus, playerEffectsDomain } from "@opencok/services/player-effects";
import { cityFixture } from "./fixtures/city-progression";
import { decode, sfs, type Value } from "@opencok/messages/sfs";
const rules = await loadRules();

test("applyProgressionStatus_skinItem_omitsBonusesFromTheNativeResponse", async () => {
    const local = await loadRules();
    local.power.statuses!.set("990001", {
        id: "990001",
        type2: "100",
        subgroup: "1",
        effect: "50;99",
        time: "3600",
    });
    const { context } = cityFixture(local);

    const body = applyProgressionStatus(context, "990001");

    expect(body.status).toEqual(sfs.array([]));
    expect(body.statusId).toEqual(sfs.int(990001));
    expect(context.write.states![0]!.endTime).toBe(context.now + 3600000n);
});

test("showStatusItem_savedRandomSkin_clearsDisplayedBonusesWithoutChangingSavedState", async () => {
    const local = await loadRules();
    local.power.statuses!.set("990001", {
        id: "990001",
        type2: "100",
        random: "1",
        effect: "50;99",
    });
    const { context, state } = cityFixture(local);
    state.effects.states = [{
        stateId: 990001,
        type2: 100,
        startTime: 0n,
        endTime: context.now + 1000n,
        ranEffId: 50,
        ranEffValue: 99,
    }];
    const persisted = structuredClone(state.effects.states);

    const result = await playerEffectsDomain.prepare(context, "show.status.item", {});
    const statuses = decode(Buffer.from(result.response)).statusItems!.value as Value[];

    expect(statuses[0]!.value).toMatchObject({
        id: sfs.int(990001),
        ranEffId: sfs.int(-1),
        ranEffValue: sfs.int(0),
    });
    expect(state.effects.states).toEqual(persisted);
});
test("talent points enforce tree membership, OR prerequisites, and total budget", () => {
    expect(
        validateTalentTrees([{ id: "50000", "600000": 5, "600100": 5, "601000": 1 }], rules, 11),
    ).toBe(0);
    expect(() => validateTalentTrees([{ id: "50000", "600100": 1 }], rules, 100)).toThrow();
    expect(() => validateTalentTrees([{ id: "50000", "620000": 1 }], rules, 100)).toThrow();
    expect(() => validateTalentTrees([{ id: "50000", "600000": 5 }], rules, 4)).toThrow();
    expect(() => validateTalentTrees([{ id: "50000", "600000": 6 }], rules, 100)).toThrow();
});
test("VIP duration extends once and score thresholds activate VIP", () => {
    const first = vipMutation(undefined, rules, "owner", 1000n, 70, 60);
    expect(first.vipEndTime).toBe(61000n);
    expect(vipMutation(first, rules, "owner", 2000n, 70, 60).vipEndTime).toBe(121000n);
    const leveled = vipMutation({ ...first, level: 0 }, rules, "owner", 2000n, 110, 500);
    expect(leveled.level).toBe(1);
    expect(leveled.vipEndTime).toBe(86461000n);
    const superVip = vipMutation({ ...first, score: 299999 }, rules, "owner", 2000n, 110, 101);
    expect(superVip.score).toBe(300000);
    expect(superVip.sPoint).toBe(5);
    expect(superVip.sLevel).toBe(1);
});
test("temporary effects extend duration without duplicating bonuses and expire at the boundary", () => {
    const first = temporaryEffect([], rules, "owner", "500080", 1000n, 1, () => 0);
    const second = temporaryEffect(first.states, rules, "owner", "500080", 2000n, 1, () => 0);
    expect(second.states).toHaveLength(1);
    expect(second.states[0]!.endTime).toBe(172801000n);
    const fixture = cityFixture(rules);
    fixture.state.effects.states = second.states;
    expect(storedPowerEffects(fixture.state.effects, rules, 2000, 50).status).toBe(25);
    expect(storedPowerEffects(fixture.state.effects, rules, 172801000, 50).status).toBe(0);
    expect(storedPowerEffects(fixture.state.effects, rules, 0, 50).status).toBe(0);
});
test("talent changes reject foreign generals and free point reductions", async () => {
    const { context, state } = cityFixture(rules);
    state.profile.level = 10;
    state.effects.generals = [
        {
            uid: "owner",
            uuid: "general",
            level: 10,
            abilityIndex: 1,
            ability: Buffer.from("[{\"id\":\"50000\",\"600000\":5}]"),
        },
    ];
    await expect(
        playerEffectsDomain.prepare(context, "skill.save", {
            gUid: sfs.string("foreign"),
            abilityId: sfs.string("50000"),
            skill: sfs.object({ "600000": sfs.int(1) }),
        }),
    ).rejects.toThrow();
    await expect(
        playerEffectsDomain.prepare(context, "skill.save", {
            gUid: sfs.string("general"),
            abilityId: sfs.string("50000"),
            skill: sfs.object({ "600000": sfs.int(1) }),
        }),
    ).rejects.toThrow();
    await playerEffectsDomain.prepare(context, "skill.clear", { gUid: sfs.string("general") });
    expect(context.balance("gold")).toBe(99000n);
    expect(context.write.generals?.[0]?.ability).toEqual(Buffer.from("[]"));
});

test("harvest talent credits its bonus once and preserves the cooldown", async () => {
    const { context, state, balances } = cityFixture(rules);
    state.profile.level = 10;
    state.effects.generals = [
        {
            uid: "owner",
            uuid: "harvester",
            level: 10,
            abilityIndex: 1,
            ability: Buffer.from("[{\"id\":\"50001\",\"610700\":1}]"),
        },
    ];
    const before = balances.get("wood")!,
        production = rules.building("413000", 1).effects!.productionPerHour!;
    await playerEffectsDomain.prepare(context, "skill.use", {
        gUid: sfs.string("harvester"),
        skillId: sfs.string("610700"),
    });
    expect(balances.get("wood")).toBe(before + BigInt(production * 5));
    expect(context.write.skills?.[0]?.endTime).toBe(context.now + 720n * 60000n);
    state.skills = context.write.skills!;
    await expect(
        playerEffectsDomain.prepare(context, "skill.use", {
            gUid: sfs.string("harvester"),
            skillId: sfs.string("610700"),
        }),
    ).rejects.toThrow();
    expect(balances.get("wood")).toBe(before + BigInt(production * 5));
});
