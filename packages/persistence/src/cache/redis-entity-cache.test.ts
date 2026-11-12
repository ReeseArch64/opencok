import { describe, expect, test } from "bun:test";
import { RedisEntityCache } from "./redis-entity-cache";

const publicId = "b6f84dc5-cd4e-47cc-a3c7-82a67c0c84bd";
const key = `opencok:cache:v1:world:{${publicId}}`;
const value = { name: "world" };
const codec = {
    encode: (input: typeof value) => JSON.stringify(input),
    decode: (input: string) => JSON.parse(input) as typeof value,
};

function fixture(cached: string | null = null)
{
    const commands: { command: string; args: string[]; }[] = [];
    const reads: string[] = [];
    const errors: unknown[] = [];
    const client = {
        get: async (input: string) => {
            reads.push(input);
            return cached;
        },
        send: async (command: string, args: string[]) => {
            commands.push({ command, args });
            return null;
        },
    };
    const cache = new RedisEntityCache("world", codec, {
        client,
        ttlSeconds: 30,
        onError: error => errors.push(error),
    });
    return { cache, client, commands, reads, errors };
}

describe("Redis entity cache with an in-memory command recorder, no Redis server", () => {
    test("a hit decodes without loading or writing", async () => {
        const { cache, commands, reads } = fixture(JSON.stringify(value));
        let loads = 0;
        expect(
            await cache.remember(publicId.toUpperCase(), async () => {
                loads++;
                return null;
            }),
        ).toEqual(value);
        expect(loads).toBe(0);
        expect(reads).toEqual([key]);
        expect(commands).toEqual([]);
    });

    test("a miss commits with the same load token, key hash tag and TTL", async () => {
        const { cache, commands } = fixture();
        expect(await cache.remember(publicId, async () => value)).toBe(value);
        expect(commands).toHaveLength(2);
        const [lock, commit] = commands;
        const token = lock?.args[1];
        if (!lock || !commit || typeof token !== "string")
        {
            throw new Error("Cache miss did not issue a token and commit");
        }
        expect(lock.command).toBe("SET");
        expect(token).toMatch(/^[0-9a-f-]{36}$/);
        expect(lock.args).toEqual([`${key}:load`, token, "EX", "30"]);
        expect(commit.command).toBe("EVAL");
        expect(commit.args.slice(1)).toEqual([
            "2",
            key,
            `${key}:load`,
            token,
            JSON.stringify(value),
            "30",
        ]);
        expect(commit.args[0]).toContain("redis.call('GET', KEYS[2]) == ARGV[1]");
    });

    test("null loads are not published as cached values", async () => {
        const { cache, commands } = fixture();
        expect(await cache.remember(publicId, async () => null)).toBeNull();
        expect(commands.map(entry => entry.command)).toEqual(["SET"]);
    });

    test("invalid inputs fail before issuing commands or loading", async () => {
        const { cache, client, commands, reads } = fixture();
        let loads = 0;
        await expect(cache.remember("invalid", async () => {
            loads++;
            return value;
        })).rejects.toThrow();
        await expect(cache.invalidate("invalid")).rejects.toThrow();
        for (const ttlSeconds of [0, -1, 0.5, 2_147_483_648])
        {
            expect(() => new RedisEntityCache("world", codec, { client, ttlSeconds })).toThrow();
        }
        expect(loads).toBe(0);
        expect(reads).toEqual([]);
        expect(commands).toEqual([]);
    });

    test("corrupt cached data falls back without publishing an unlocked load", async () => {
        const { cache, commands, errors } = fixture("not JSON");
        expect(await cache.remember(publicId, async () => value)).toBe(value);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toBeInstanceOf(SyntaxError);
        expect(commands).toEqual([]);
    });

    test("read failures fall back but loader failures propagate unchanged", async () => {
        const { cache, client, commands, errors } = fixture();
        const redisFailure = new Error("Redis unavailable");
        client.get = async () => {
            throw redisFailure;
        };
        expect(await cache.remember(publicId, async () => value)).toBe(value);
        expect(errors).toEqual([redisFailure]);
        const storeFailure = new Error("store unavailable");
        await expect(cache.remember(publicId, async () => {
            throw storeFailure;
        })).rejects.toBe(storeFailure);
        expect(commands).toEqual([]);
    });

    test("publish and invalidation failures are reported without losing store results", async () => {
        const { cache, client, errors } = fixture();
        const failure = new Error("write unavailable");
        client.send = async command => {
            if (command !== "SET")
            {
                throw failure;
            }
            return null;
        };
        expect(await cache.remember(publicId, async () => value)).toBe(value);
        await expect(cache.invalidate(publicId)).resolves.toBeUndefined();
        expect(errors).toEqual([failure, failure]);
    });

    test("invalidation deletes the value and pending load token together", async () => {
        const { cache, commands } = fixture();
        await cache.invalidate(publicId);
        expect(commands).toEqual([{ command: "DEL", args: [key, `${key}:load`] }]);
    });
});
