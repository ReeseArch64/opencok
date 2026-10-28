import { expect, test } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
    goldEggsEnabled,
    goldEggsPeriod,
    goldEggsCalendar,
    goldEggsDisk,
    goldEggsCells,
    goldEggsCellText,
    goldEggsDraw,
    goldEggsMultiplier,
    goldEggsClaims,
    goldEggsPrizes,
    goldEggsSort,
} from "@opencok/rules/gold-eggs";
import { goldEggsCellsView, goldEggsRankingView } from "@opencok/mappings/gold-eggs";
import { pinGoldEggRewards } from "../../../packages/services/src/gold-eggs-rewards";
import type { CityProgressionContext } from "@opencok/services/city-progression";
import { sfs, fields, encode, decode, type Value } from "@opencok/messages/sfs";
import { configureGoldEggs, goldEggsNow } from "./fixtures/gold-eggs";

test("maintained GoldEggs catalogs preserve historical dates, gated periods and native board shapes with bounded fallback draws", async () => {
    const rules = await loadRules(),
        period = goldEggsPeriod(rules)!;
    expect(period).toEqual({
        start: BigInt(Date.UTC(2021, 3, 1, 12)),
        end: BigInt(Date.UTC(2025, 4, 1, 12)),
    });
    expect(goldEggsCalendar(rules, BigInt(goldEggsNow))!.admitted).toBe(false);
    const board = goldEggsDisk(rules, () => 0);
    expect(board).toHaveLength(30);
    expect(goldEggsCells(goldEggsCellText(board), rules)).toEqual(board);
    const projected = decode(encode({ list: goldEggsCellsView(board) }));
    expect((projected.list!.value as Value[]).map(fields)[0]).toEqual({
        id: sfs.string(board[0]!.id),
        type: sfs.int(board[0]!.type),
        state: sfs.bool(false),
    });
    const cap = [...rules.advanced.goldenEggs!.values()].find((row) => row.max)!;
    for (const [id, row] of rules.advanced.goldenEggs!)
    {
        rules.advanced.goldenEggs!.set(id, { ...row, rate: id === cap.id ? "1" : "0" });
    }
    const capped = goldEggsDisk(rules, () => 0);
    expect(capped.filter((row) => row.id === cap.id)).toHaveLength(Number(cap.max));
    expect(capped.slice(Number(cap.max)).every((row) => row.id === "9051002")).toBe(true);
    for (const random of [() => -1, (maximum: number) => maximum, () => 0.5, () => NaN])
    {
        expect(() => goldEggsDisk(rules, random)).toThrow();
    }
    expect(() => goldEggsDraw([{ value: "x", weight: 2147483648 }], () => 0)).toThrow();
    expect(() => goldEggsCells("unknown;1;0", rules)).toThrow();
    expect(() => goldEggsCells("9051002;0;0", rules)).toThrow();
    expect(goldEggsMultiplier({ status: "2;300|4;200" }, 1, () => 0)).toBe(3);
    expect(goldEggsMultiplier({ status: "2;300|4;200" }, 1, (maximum) => maximum - 1)).toBe(5);
    rules.features.set("golden_egg_open", {
        id: "golden_egg_open",
        online: "close",
        test: "close",
        version: "7.23.0",
    });
    expect(goldEggsEnabled(rules, BigInt(goldEggsNow))).toBe(false);
    rules.features.set("golden_egg_open", {
        id: "golden_egg_open",
        online: "all",
        test: "all",
        version: "13.0.0",
    });
    expect(goldEggsEnabled(rules, BigInt(goldEggsNow))).toBe(false);
});
test("GoldEggs weighted multipliers perform independent reward loops while guaranteed rewards scale counts and merged resources once", async () => {
    const rules = await loadRules();
    configureGoldEggs(rules);
    const context = { rules, now: BigInt(goldEggsNow) } as CityProgressionContext;
    let draws = 0;
    const raw = pinGoldEggRewards(
        context,
        ["990001"],
        3,
        (maximum) => draws++ === 1 ? maximum - 1 : 0,
    );
    expect(raw.split("|").sort()).toEqual(["goods,200001,2", "goods,200002,1"]);
    expect(draws).toBe(3);
    draws = 0;
    expect(
        pinGoldEggRewards(context, ["990002", "990002"], 3, () => {
            draws++;
            return 0;
        })
            .split("|")
            .sort(),
    ).toEqual(["gold,0,42", "goods,200003,12", "wood,0,66"]);
    expect(draws).toBe(2);
    expect(() => pinGoldEggRewards(context, ["990001"], 10001, () => 0)).toThrow();
    expect(() => pinGoldEggRewards(context, Array(4097).fill("990001"), 1, () => 0)).toThrow();
    expect(() => pinGoldEggRewards(context, ["missing"], 1, () => 0)).toThrow();
    expect(goldEggsClaims("0;1", rules)).toEqual([0, 1]);
    for (const claim of ["0;0", "-1", "2", "0;", "0|1"])
    {
        expect(() => goldEggsClaims(claim, rules)).toThrow();
    }
    for (const prize of ["0;1", "1-5;2|5-9;3", "1-151;2", "1;not-a-reward"])
    {
        expect(() => goldEggsPrizes(prize)).toThrow();
    }
});
test("native local and global rankings preserve factual long scores, Source field spelling, own realm identity and stable ties", () => {
    const row = {
        uid: "same",
        kingdomId: 2,
        score: 9007199254740993n,
        createdAt: 123n,
        name: "Synthetic",
        pic: "",
        picVer: 0,
        picfraId: 0,
    };
    const rows = goldEggsSort([
        { ...row, uid: "z" },
        { ...row, kingdomId: 1 },
        row,
        { ...row, uid: "lower", score: 1n },
    ]);
    expect(rows.map((row) => `${row.kingdomId}:${row.uid}`)).toEqual([
        "1:same",
        "2:same",
        "2:z",
        "2:lower",
    ]);
    const local = decode(encode(goldEggsRankingView(rows, "same", 2)));
    expect(local.selfRanking).toEqual(sfs.int(2));
    const global = decode(encode(goldEggsRankingView(rows, "same", 2, true))),
        first = fields((global.allRank!.value as Value[])[0]);
    expect(first.rank).toEqual(sfs.int(1));
    expect(first.sid).toEqual(sfs.string("1"));
    for (const field of ["score", "val", "socre"])
    {
        expect(first[field]).toEqual(sfs.long(row.score));
    }
    expect(() => goldEggsSort(Array(301).fill(row))).toThrow();
});
