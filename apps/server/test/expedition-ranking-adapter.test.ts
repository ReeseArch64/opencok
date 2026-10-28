import { expect, test } from "bun:test";
import { Cache } from "@opencok/storage/session";

const pairing = "{\"serverId\":2,\"matchServerId\":1}";
function fixture(responses: unknown[], kingdomId = 2)
{
    const calls: { command: string; args: string[]; }[] = [];
    const cache = new Cache({ redisUrl: "unused", timeoutMs: 1, kingdomId });
    cache.command = async (command, ...args) => {
        calls.push({ command, args });
        if (!responses.length)
        {
            throw new Error("Unexpected dependency call");
        }
        const response = responses.shift();
        if (response instanceof Error)
        {
            throw response;
        }
        return response;
    };
    return { cache, calls };
}

test("expedition adapter routes to the lower realm and reads pairing, scores and metadata coherently", async () => {
    const { cache, calls } = fixture([pairing, [1, ["z", "2.5", "{}"], ["a", "2.5", null]]]);
    expect(await cache.expeditionRanking(3)).toEqual([
        { uid: "z", score: 2.5, info: "{}" },
        { uid: "a", score: 2.5, info: null },
    ]);
    expect(calls[0]).toEqual({ command: "GET", args: ["opencok:global:expedition-match:2"] });
    expect(calls[1]?.command).toBe("EVAL");
    expect(calls[1]?.args.slice(1)).toEqual([
        "3",
        "opencok:global:expedition-match:2",
        "opencok:kingdom:1:expedition-ranking",
        "opencok:kingdom:1:expedition-ranking-info",
        pairing,
        "2",
    ]);
    const script = calls[1]!.args[0]!;
    expect(script).toContain("if pairing ~= ARGV[1] then return {0} end");
    expect(script).toContain("'ZREVRANGE', KEYS[2], 0, ARGV[2], 'WITHSCORES'");
    expect(script).toContain("'HGET', KEYS[3], scores[index]");
    expect(script).toContain("if size > 65535 or bytes > 1048576 then return {2} end");
    expect(script).not.toMatch(/\b(SET|HSET|ZADD|DEL|EXPIRE|INCR)\b/);
    const upper = fixture(["{\"serverId\":2,\"matchServerId\":3}", [1]]);
    expect(await upper.cache.expeditionRanking(1)).toEqual([]);
    expect(upper.calls[1]?.args[3]).toBe("opencok:kingdom:2:expedition-ranking");
});

test("expedition adapter retries one rematch and rejects repeated churn without mixing board keys", async () => {
    const replacement = "{\"serverId\":2,\"matchServerId\":3}";
    const { cache, calls } = fixture([pairing, [0], replacement, [1, ["self", "1", "{}"]]]);
    expect(await cache.expeditionRanking(2)).toEqual([{ uid: "self", score: 1, info: "{}" }]);
    expect(calls).toHaveLength(4);
    expect(calls[1]?.args[3]).toBe("opencok:kingdom:1:expedition-ranking");
    expect(calls[3]?.args[3]).toBe("opencok:kingdom:2:expedition-ranking");
    const churn = fixture([pairing, [0], replacement, [0]]);
    await expect(churn.cache.expeditionRanking(2)).rejects.toThrow("redis");
    expect(churn.calls).toHaveLength(4);
});

test("expedition missing and unmatched state skip boards while invalid identity or storage failures reject", async () => {
    for (const raw of [null, "{\"serverId\":2,\"matchServerId\":-1}"])
    {
        const { cache, calls } = fixture([raw]);
        expect(await cache.expeditionRanking(2)).toBeUndefined();
        expect(calls).toHaveLength(1);
    }
    for (
        const raw of [
            "{",
            "[]",
            "null",
            "{}",
            "{\"serverId\":1,\"matchServerId\":2}",
            "{\"serverId\":2,\"matchServerId\":0}",
            "{\"serverId\":2,\"matchServerId\":2.5}",
            "{\"serverId\":2,\"matchServerId\":2147483648}",
            " ".repeat(65536),
            new Error("Synthetic Redis failure"),
        ]
    )
    {
        const { cache } = fixture([raw]);
        await expect(cache.expeditionRanking(2)).rejects.toThrow();
    }
    for (const limit of [0, -1, 1.5, 32768])
    {
        const { cache, calls } = fixture([]);
        await expect(cache.expeditionRanking(limit)).rejects.toThrow();
        expect(calls).toEqual([]);
    }
    const invalidRealm = fixture([], 0);
    await expect(invalidRealm.cache.expeditionRanking(2)).rejects.toThrow();
    expect(invalidRealm.calls).toEqual([]);
    const failure = fixture([pairing, new Error("Synthetic board failure")]);
    await expect(failure.cache.expeditionRanking(2)).rejects.toThrow("Synthetic board failure");
});

test("expedition adapter bounds payloads and preserves finite and infinite Redis scores", async () => {
    const valid = fixture([
        pairing,
        [1, ["first", "inf", null], ["second", "-inf", ""], ["third", "1e3", "{}"]],
    ]);
    expect((await valid.cache.expeditionRanking(3))?.map((entry) => entry.score)).toEqual([
        Infinity,
        -Infinity,
        1000,
    ]);
    for (
        const response of [
            null,
            [],
            [0, "extra"],
            [2],
            [1, ["a", "1"]],
            [1, ["", "1", null]],
            [1, ["a", "NaN", null]],
            [1, ["a", "1e999", null]],
            [1, ["a", " ", null]],
            [1, ["a", "1", 5]],
            [1, ["a", "1", "x".repeat(65536)]],
            [1, ["a", "1", null], ["a", "1", null]],
            [1, ["a", "1", null], ["b", "1", null], ["c", "1", null]],
        ]
    )
    {
        const { cache } = fixture([pairing, response]);
        await expect(cache.expeditionRanking(2)).rejects.toThrow("redis");
    }
    const oversized = fixture([
        pairing,
        [1, ...Array.from({ length: 17 }, (_, i) => [String(i), "1", "x".repeat(65535)])],
    ]);
    await expect(oversized.cache.expeditionRanking(20)).rejects.toThrow("redis");
});
