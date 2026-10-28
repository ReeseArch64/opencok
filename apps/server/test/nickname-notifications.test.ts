import { expect, test } from "bun:test";
import { nicknameNotification, nicknameChangeReply } from "@opencok/mappings/nickname-change";
import {
    nicknameItemAddSchema,
    nicknameMobileGoldSchema,
    nicknameChangeReplySchema,
} from "@opencok/validations/nickname-change";
import { decode, encode, sfs, Type, type Fields } from "@opencok/messages/sfs";
import type { NicknameNotification } from "@opencok/contracts/nickname-change";
import type { Rule } from "@opencok/rules/game";

const rules = {
    goods: new Map<string, Rule>([
        [
            "200021",
            {
                type: "17",
                price: "100",
                para1: "first",
                para2: " \t",
                para3: "\u00a0",
                para9: "last",
                para10: "excluded",
            },
        ],
    ]),
};
const balances = {
    gold: 9007199254740993n,
    paidGold: -4n,
    paidSpecialGold: 2n,
    dmmGold: 123n,
    dmmPaidGold: 456n,
    dmmPaidSpecialGold: 789n,
};
const item: NicknameNotification = {
    kind: "item",
    stage: "debit",
    item: { uuid: "synthetic-item", count: 0, vanishTime: 9007199254740994n },
};

test("nickname item pushes retain exact field order, widths and optional goods parameters", () => {
    const debit = nicknameNotification(item, rules);
    expect(debit.command).toBe("push.item.del");
    expect(Object.keys(debit.body)).toEqual(["uuid", "itemId", "count"]);
    expect(decode(encode(debit.body))).toEqual({
        uuid: sfs.string("synthetic-item"),
        itemId: sfs.string("200021"),
        count: sfs.int(0),
    });
    const refund = nicknameNotification(
        { ...item, stage: "refund", item: { ...item.item, count: 7 } },
        rules,
    );
    expect(refund.command).toBe("push.item.add");
    expect(Object.keys(refund.body)).toEqual([
        "uuid",
        "itemId",
        "count",
        "vanishTime",
        "para1",
        "para3",
        "para9",
    ]);
    expect(decode(encode(refund.body))).toMatchObject({
        count: sfs.int(7),
        vanishTime: sfs.long(9007199254740994n),
        para1: sfs.string("first"),
        para3: sfs.string("\u00a0"),
        para9: sfs.string("last"),
    });
    expect(nicknameNotification({ ...item, stage: "refund" }, rules).command).toBe("push.item.del");
});

test("item presentation failures cannot be replaced with missing catalog data", () => {
    const missing = { goods: new Map<string, Rule>() };
    expect(nicknameNotification(item, missing).command).toBe("push.item.del");
    const refund = { ...item, stage: "refund" as const, item: { ...item.item, count: 1 } };
    expect(() => nicknameNotification(refund, missing)).toThrow(
        "Nickname item catalog unavailable",
    );
    const invalid = { goods: new Map([["200021", { para1: 1 } as unknown as Rule]]) };
    expect(() => nicknameNotification(refund, invalid)).toThrow("Invalid nickname item parameter");
});

test("mobile and exact DMM pushes expose only their respective signed Long balances", () => {
    for (const platform of [null, "synthetic", "DMM", "dmm"])
    {
        const message = nicknameNotification(
            { kind: "gold", stage: "debit", platform, balances },
            rules,
        );
        expect(message.command).toBe(
            platform === "dmm" ? "push.dmm.gold.change" : "push.mobile.gold.change",
        );
        const expected: Fields = platform === "dmm"
            ? {
                dmmGold: sfs.long(123n),
                dmmPaidGold: sfs.long(456n),
                dmmPaidSpecialGold: sfs.long(789n),
            }
            : {
                freeGold: sfs.long(9007199254740993n),
                paidGold: sfs.long(-4n),
                paidSpecialGold: sfs.long(2n),
            };
        expect(Object.keys(message.body)).toEqual(Object.keys(expected));
        expect(Object.values(message.body).every((value) => value.type === Type.Long)).toBe(true);
        expect(decode(encode(message.body))).toEqual(expected);
    }
});

test("nickname replies retain optional debit gold before the boolean terminal status", () => {
    expect(nicknameChangeReply({ state: "committed", responseGold: null })).toEqual({
        status: sfs.bool(true),
    });
    for (const state of ["committed", "refunded"])
    {
        const reply = nicknameChangeReply({ state, responseGold: 9007199254740993n });
        expect(Object.keys(reply)).toEqual(["gold", "status"]);
        expect(decode(encode(reply))).toEqual({
            gold: sfs.long(9007199254740993n),
            status: sfs.bool(state === "committed"),
        });
    }
    expect(() => nicknameChangeReply({ state: "prepared", responseGold: 10n })).toThrow(
        "Nickname change is pending",
    );
});

test("notification DTO validation rejects width violations, unknown fields and non-boolean status", () => {
    expect(() =>
        nicknameItemAddSchema.parse({
            uuid: "x",
            itemId: "200021",
            count: 2147483648,
            vanishTime: 0n,
        })
    ).toThrow();
    expect(() =>
        nicknameMobileGoldSchema.parse({
            freeGold: 9223372036854775808n,
            paidGold: 0n,
            paidSpecialGold: 0n,
        })
    ).toThrow();
    expect(() => nicknameChangeReplySchema.parse({ status: 1 })).toThrow();
    expect(() => nicknameChangeReplySchema.parse({ status: true, ownerUid: "hidden" })).toThrow();
});
