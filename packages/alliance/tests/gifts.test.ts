import { expect, test } from "bun:test";
import { decode, encode, sfs } from "@opencok/messages/sfs";
import { AllianceGiftService } from "../src/services/gifts";
import { AllianceGiftPolicy } from "../src/rules/gifts";
import { AllianceGiftMapper } from "../src/mappings/gifts";
import type { AllianceGiftContext, AllianceGiftState } from "../src/contracts/gifts";
import type { AllianceRecord } from "../src/contracts/records";
import type { AllianceGiftRule } from "../src/contracts/gift-catalog";

const fail = (): never => {
    throw new Error("Unavailable alliance gift");
};
const readers = {
    text: (row: AllianceRecord, key: string) => String(row[key] ?? ""),
    num: (row: AllianceRecord, key: string) => Number(row[key] ?? 0),
    long: (row: AllianceRecord, key: string) => BigInt(String(row[key] ?? 0)),
};
const cityInteger = (value: unknown, minimum = 0, maximum = Number.MAX_SAFE_INTEGER) => {
    const number = Number(value);

    if (!Number.isSafeInteger(number) || number < minimum || number > maximum)
    {
        fail();
    }

    return number;
};
const policy = new AllianceGiftPolicy({ cityInteger, allianceFailure: fail });
const mapper = new AllianceGiftMapper(readers);

function fixture(changes: Partial<AllianceGiftState> = {})
{
    const credits: unknown[][] = [];
    const picks: string[][] = [];
    const ledger = {
        add: (id: string, count: number, value?: number) =>
            credits.push(["item", id, count, value]),
    };
    let guild: AllianceRecord = { uid: "alliance", giftlevel: 1000 };
    let member: AllianceRecord = { uid: "owner", point: 7, accPoint: 12 };
    const rule: AllianceGiftRule = {
        rss1: "0",
        rate1: "1",
        num1: "3",
        item_1: "200001",
        rate_1: "2",
        num_1: "4",
        time: "1",
        exp: "5",
    };
    const rules = { alliance: { gifts: new Map([["30000", rule]]) } };
    const context: AllianceGiftContext<typeof ledger> = {
        owner: "owner",
        allianceId: "alliance",
        now: 1000n,
        rules,
        ledger,
        write: {},
        state: {
            gifts: [{
                uuid: "gift",
                uid: "owner",
                allianceId: "alliance",
                gifttype: 30002,
                valid: 1,
                level: 2,
                item: "0",
                num: 3,
                para: 8,
                time: 1000n,
                expiretime: 1,
                exp: 5,
            }],
            sharedGifts: [],
            ...changes,
        },
        alliance: () => guild,
        member: () => member,
        list: () => [{ uid: "owner" }, { uid: "other" }],
        setMember: (value) => {
            member = value;
        },
        setAlliance: (value) => {
            guild = value;
        },
    };
    let sequence = 0;
    const runtime = {
        ...readers,
        cityInteger,
        allianceFailure: fail,
        inventoryWeighted: (choices: ReadonlyMap<string, number>) => {
            const keys = [...choices.keys()];
            picks.push(keys);

            return keys[(picks.length - 1) % keys.length]!;
        },
        randomUUID: () => `gift-${++sequence}`,
        activityEconomy: (input: typeof ledger) => {
            expect(input).toBe(ledger);

            return {
                gold: (amount: bigint) => credits.push(["gold", amount]),
                resource: (kind: string, amount: bigint) => credits.push([kind, amount]),
            };
        },
    };

    return {
        context,
        rules,
        rule,
        credits,
        picks,
        service: new AllianceGiftService(context, runtime, policy, mapper),
    };
}

test("producer pins each recipient outcome and saved-event replay never rerolls", () => {
    const { context, rules, service, picks } = fixture();
    rules.alliance.gifts.set("30002", {
        rss1: "0",
        rate1: "1",
        num1: "7",
        rss2: "0",
        rate2: "2",
        num2: "9",
        time: "2",
        exp: "13",
    });
    expect(service.publish("event", 30000)).toEqual({ giftId: sfs.string("event") });
    expect(picks).toEqual([["rss1:0", "rss2:0"], ["rss1:0", "rss2:0"]]);
    expect(context.write.publishedGift).toEqual({
        uid: "event",
        allianceid: "alliance",
        level: 2,
        typeId: 30000,
        time: 1000n,
        expiretime: 2,
    });
    expect(context.write.sharedGifts?.map((row) => [row.uuid, row.uid, row.item, row.num, row.exp]))
        .toEqual([["gift-1", "owner", "0", 7, 13], ["gift-2", "other", "0", 9, 13]]);
    const replay = fixture({ sharedGifts: [context.write.publishedGift!] });
    replay.rules.alliance.gifts.clear();
    expect(replay.service.publish("event", 30000)).toEqual({ giftId: sfs.string("event") });
    expect(replay.picks).toEqual([]);
    expect(replay.context.write).toEqual({});
});

test("producer validates type, saved alliance and catalog weights before granting anything", () => {
    for (
        const saved of [{ allianceid: "foreign", typeId: 30000 }, {
            allianceid: "alliance",
            typeId: 30100,
        }]
    )
    {
        const h = fixture({ sharedGifts: [saved] });
        expect(() => h.service.publish("event", 30000)).toThrow("Unavailable alliance gift");
        expect(h.context.write).toEqual({});
    }

    const h = fixture();
    expect(() => h.service.publish("event", 30001)).toThrow("Unavailable alliance gift");
    h.rules.alliance.gifts.clear();
    expect(() => h.service.publish("event", 30000)).toThrow("Unavailable alliance gift");
    expect(() => policy.choices({ rss1: "0", rate1: "0", num1: "0" })).toThrow();
    expect(() => policy.choices({ rss1: "0", rate1: "-1", num1: "1" })).toThrow();
    expect(() => policy.choices({ ignored: "1" })).toThrow();
    expect([...policy.choices({ ...h.rule, rate1: "0" }).choices]).toEqual([["item_1:200001", 2]]);
    expect(h.context.write).toEqual({});
});

test("claims retain resource, gold, honor and parameterized-item rewards with alliance experience", () => {
    const initial = fixture().context.state.gifts[0]!;

    for (
        const [item, expected] of [
            ["0", [["wood", 3n]]],
            ["5", [["gold", 3n]]],
            ["6", []],
            ["200001", [["item", "200001", 3, 8]]],
        ] as [string, unknown[][]][]
    )
    {
        const h = fixture({ gifts: [{ ...initial, item }] });
        expect(h.service.command("al.opengift", { giftId: sfs.string("gift") })).toEqual({
            item: sfs.string(item),
            num: sfs.int(3),
            exp: sfs.int(5),
            para: sfs.int(8),
        });
        expect(h.credits).toEqual(expected);
        expect(h.context.write.gifts?.[0]?.valid).toBe(0);
        expect(h.context.alliance().giftlevel).toBe(1005);
        expect(h.context.member().point).toBe(item === "6" ? 10 : 7);
        expect(h.context.member().accPoint).toBe(item === "6" ? 15 : 12);
        const replay = fixture({ gifts: h.context.write.gifts! });
        expect(() => replay.service.command("al.opengift", { giftId: sfs.string("gift") }))
            .toThrow("Unavailable alliance gift");
        expect(replay.credits).toEqual([]);
        expect(replay.context.write).toEqual({});
    }
});

test("owner, alliance and exact expiry gate claims and only consumed or expired gifts can clear", () => {
    const initial = fixture().context.state.gifts[0]!;

    for (
        const changes of [{ uid: "other" }, { allianceId: "foreign" }, {
            time: -3599000n,
        }] as AllianceRecord[]
    )
    {
        const h = fixture({ gifts: [{ ...initial, ...changes }] });
        expect(() => h.service.command("al.opengift", { giftId: sfs.string("gift") })).toThrow();
        expect(h.credits).toEqual([]);
        expect(h.context.write).toEqual({});
    }

    const active = fixture();
    expect(() => active.service.command("al.cleargift", { giftId: sfs.string("gift") })).toThrow();

    for (const changes of [{ valid: 0 }, { time: -3599000n }] as AllianceRecord[])
    {
        const h = fixture({ gifts: [{ ...initial, ...changes }] });
        expect(h.service.command("al.cleargift", { giftId: sfs.string("gift") })).toEqual({
            stats: sfs.int(1),
        });
        expect(h.context.write).toEqual({ deletedGifts: ["gift"] });
        expect(h.credits).toEqual([]);
    }
});

test("gift snapshots retain native spelling, field order, exact time and lazy alliance reads", () => {
    const row = { ...fixture().context.state.gifts[0]!, time: 9007199254740993n };
    let reads = 0;
    const result = mapper.snapshot(row, () => {
        reads++;

        return { giftlevel: 1999 };
    }, 1000n);
    expect(reads).toBe(3);
    expect(Object.keys(result)).toEqual([
        "giftId",
        "uuid",
        "type",
        "gifttype",
        "giftlevel",
        "alliancegfitexp",
        "alliancegiftlevel",
        "nextlevelexp",
        "timeleft",
        "level",
        "valid",
        "item",
        "num",
        "para",
        "exp",
        "time",
        "expiretime",
    ]);
    expect(result.alliancegfitexp).toEqual(sfs.int(1999));
    expect(result.alliancegiftlevel).toEqual(sfs.int(1));
    expect(result.nextlevelexp).toEqual(sfs.int(2000));
    expect(result.timeleft).toEqual(sfs.long(9007199258339993n));
    expect(decode(encode(result))).toEqual(result);
});

test("gift listing retains its row bound and existing expiry/alliance filters", () => {
    const row = fixture().context.state.gifts[0]!;
    const h = fixture({
        gifts: [
            row,
            { ...row, uuid: "claimed", valid: 0 },
            { ...row, uuid: "expired", time: -3599000n },
            { ...row, uuid: "foreign", allianceId: "foreign" },
        ],
    });
    expect(h.service.command("al.showgift", {})).toEqual({
        gifts: sfs.array([
            sfs.object(mapper.snapshot(row, h.context.alliance, 1000n)),
            sfs.object(
                mapper.snapshot({ ...row, uuid: "claimed", valid: 0 }, h.context.alliance, 1000n),
            ),
        ]),
    });
    const bounded = fixture({ gifts: Array.from({ length: 2049 }, () => row) });
    expect(() => bounded.service.command("al.showgift", {})).toThrow("Unavailable alliance gift");
});
