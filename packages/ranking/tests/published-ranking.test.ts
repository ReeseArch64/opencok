import { expect, test } from "bun:test";
import {
    loadAttributeRanking,
    loadPublishedGlobalRanking,
} from "@opencok/ranking/storage/published-ranking";
import { attributeRanking, publishedRanking } from "@opencok/ranking/mappings/published-ranking";
import { decode, encode, sfs } from "@opencok/messages/sfs";

const entries = [
    "{\"uid\":\"self\",\"rank\":3,\"val\":9007199254740993}",
    "{\"uid\":\"self\",\"rank\":7}",
];

test("published boards atomically read the numbered publication and stop at its first missing slot", async () => {
    for (const kind of ["payment", "consumption"] as const)
    {
        const calls: unknown[][] = [];
        const result = await loadPublishedGlobalRanking(async (...args) => {
            calls.push(args);
            return [...entries, "", "invalid ignored tail", ...Array(96).fill(null)];
        }, kind);
        expect(result).toEqual(entries);
        expect(calls).toHaveLength(1);
        expect(calls[0]?.[0]).toBe("MGET");
        expect(calls[0]).toHaveLength(101);
        expect(calls[0]?.[1]).toBe(
            `${kind === "payment" ? "paytotal" : "continuedcost"}_global_rank_1`,
        );
    }
});

test("published ranking preserves order, duplicate self positions, long payloads and visibility", () => {
    const result = decode(encode(publishedRanking(entries, "self", 1)));
    expect(result.myRank).toEqual(sfs.int(7));
    expect(result.myHide).toEqual(sfs.int(1));
    expect(result.rankList?.value).toEqual([
        sfs.object({ uid: sfs.string("self"), rank: sfs.int(3), val: sfs.long(9007199254740993n) }),
        sfs.object({ uid: sfs.string("self"), rank: sfs.int(7) }),
    ]);
    expect(publishedRanking(entries, "absent", 0).myRank).toEqual(sfs.int(-1));
    expect(() => publishedRanking(["{\"uid\":\"self\"}"], "self", 0)).toThrow();
    expect(() => publishedRanking(entries, "self", 2147483648)).toThrow();
});

test("attribute categories retain exact keys and inclusive limits without sorting published ties", async () => {
    for (
        const [type, key, end] of [
            [0, "global_attack_wins_ranking", 150],
            [1, "global_defence_wins_ranking", 29],
            [2, "global_hp_ranking", 29],
        ] as const
    )
    {
        const result = await loadAttributeRanking(
            async (...args) => {
                expect(args).toEqual(["LRANGE", `${key}_4`, "0", String(end)]);
                return entries;
            },
            4,
            type,
        );
        expect(attributeRanking(result, type).rankMap?.value).toHaveLength(2);
    }
});

test("published readers reject failed or malformed dependencies without partial success", async () => {
    const failed = async (): Promise<never> => {
        throw new Error("unavailable");
    };
    await expect(loadPublishedGlobalRanking(failed, "payment")).rejects.toThrow();
    await expect(loadPublishedGlobalRanking(async () => [], "payment")).rejects.toThrow();
    await expect(
        loadPublishedGlobalRanking(async () => [3, ...Array(99).fill(null)], "payment"),
    ).rejects.toThrow();
    await expect(loadAttributeRanking(async () => Array(31).fill("{}"), 1, 2)).rejects.toThrow();
    expect(() => attributeRanking(["{\"x\":\"" + "a".repeat(32768) + "\"}"], 0)).toThrow();
});
