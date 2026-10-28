import { expect, test } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
    eggActivityOpen,
    eggActivityDraw,
    eggActivityGoods,
    eggActivityThresholds,
    eggActivityClearCost,
    eggActivityRecord,
    eggActivityIdle,
    eggActivityMissing,
} from "@opencok/rules/egg-activity";
import { eggActivityView, eggCollectionView } from "@opencok/mappings/egg-activity";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { sfs, encode, decode } from "@opencok/messages/sfs";
import { configureEggActivity, eggActivityNow } from "./fixtures/egg-activity";

test("maintained legacy egg catalogs retain historical inclusive dates and exactly declared probability weights without invented feature controls", async () => {
    const rules = await loadRules(),
        control = rules.configuration.payControl!.get("69007")!;
    expect(control.k8).toBe("2016-08-01-00-00");
    expect(control.k9).toBe("2016-08-16-00-00");
    const start = BigInt(Date.UTC(2016, 7, 1)),
        end = BigInt(Date.UTC(2016, 7, 16));
    expect([start - 1n, start, end, end + 1n].map((at) => eggActivityOpen(rules, at))).toEqual([
        false,
        true,
        true,
        false,
    ]);
    expect(eggActivityDraw(rules, () => 0)).toBe("132500");
    expect(eggActivityDraw(rules, (maximum) => maximum - 1)).toBe("132505");
    expect(rules.advanced.eggs!.get("132500")).toMatchObject({
        time: "3600",
        exp_finish: "10",
        exp: "20",
    });
    expect(eggActivityThresholds(rules)).toEqual([
        { exp: 100, reward: "247247" },
        { exp: 300, reward: "247248" },
        { exp: 600, reward: "247249" },
        { exp: 1000, reward: "247250" },
    ]);
    for (const random of [() => -1, (maximum: number) => maximum, () => NaN, () => 0.5])
    {
        expect(() => eggActivityDraw(rules, random)).toThrow();
    }
    rules.configuration.payControl!.set("69007", { ...control, k3: "1|2" });
    expect(() => eggActivityDraw(rules, () => 0)).toThrow();
});
test("egg native snapshots preserve sentinel longs and collection types, exact whole-second cooldown rounding and bounded saved state", async () => {
    const rules = await loadRules();
    configureEggActivity(rules);
    const now = BigInt(eggActivityNow),
        row = { uid: "owner", curEgg: "132500", eggCd: eggActivityIdle, exp: 3, curExpStage: 0 };
    expect(decode(encode(eggActivityView(row)))).toEqual({
        curEgg: sfs.string("132500"),
        eggCd: sfs.long(-1),
        exp: sfs.int(3),
        curExpStage: sfs.int(0),
    });
    expect(eggCollectionView({ eggId: "132500", goods: "200001|200002", reward: 1 })).toEqual({
        egg: sfs.string("132500"),
        goods: sfs.string("200001|200002"),
        reward: sfs.int(1),
    });
    expect(eggActivityClearCost({ ...row, eggCd: now + 999n }, rules, now)).toBe(0);
    expect(eggActivityClearCost({ ...row, eggCd: now + 14000n }, rules, now)).toBe(1);
    expect(eggActivityClearCost({ ...row, eggCd: now + 15000n }, rules, now)).toBe(2);
    for (const cd of [now, now - 1n, eggActivityIdle])
    {
        expect(() => eggActivityClearCost({ ...row, eggCd: cd }, rules, now)).toThrow();
    }
    for (const goods of ["1|1", "1|", "-1", "1".repeat(201)])
    {
        expect(() => eggActivityGoods(goods)).toThrow();
    }
    expect(eggActivityMissing({ goods: "200001" }, rules.advanced.eggs!.get("132500")!)).toBe(true);
    expect(eggActivityMissing({ goods: "200001|200002" }, rules.advanced.eggs!.get("132500")!))
        .toBe(
            false,
        );
    for (
        const saved of [
            { ...row, uid: "other" },
            { ...row, eggCd: 0n },
            { ...row, exp: -1 },
            { ...row, curEgg: "x" },
        ]
    )
    {
        expect(() => eggActivityRecord(saved, "owner")).toThrow();
    }
});
test("only the six native legacy egg commands reach the owned mutation boundary; clients cannot invoke the closed-login settlement hook", async () => {
    const rules = await loadRules();
    const seen: string[] = [];
    const game = new GameService({} as GameStore, rules, { kingdomId: 1 }, () => eggActivityNow, {
        cityProgression: async (_owner, command) => {
            seen.push(command);
            return { body: { opened: sfs.bool(false) }, pushes: [] };
        },
    });
    for (
        const command of [
            "egg.act.info",
            "egg.act.open",
            "egg.act.reward",
            "egg.act.cd",
            "egg.exp.reward",
            "egg.goods.full",
        ]
    )
    {
        expect((await game.execute("owner", command, {})).body).toEqual({
            opened: sfs.bool(false),
        });
    }
    expect(seen).toHaveLength(6);
    await expect(game.execute("owner", "egg.activity.init", {})).rejects.toThrow();
});
