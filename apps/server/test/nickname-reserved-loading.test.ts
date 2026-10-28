import { expect, test } from "bun:test";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { Cache } from "@opencok/storage/session";
import { NicknameWordFilter } from "@opencok/policy/resources/nickname-words";
import { loadNicknameServices } from "../src/nickname.ts";

const keys = ["regular", "strict", "pattern", "weight", "name"].map(
    (kind) => `forbidden_words_${kind}`,
);

class FakeCache extends Cache
{
    readonly calls: string[][] = [];
    replies = new Map<string, unknown>();
    failures = new Set<string>();

    constructor()
    {
        super({ redisUrl: "redis://unused", kingdomId: 7, timeoutMs: 100 });
    }

    override async command(command: string, ...args: string[]): Promise<unknown>
    {
        this.calls.push([command, ...args]);
        if (this.failures.has(args[0]!))
        {
            throw new Error("Synthetic list command failure");
        }
        return this.replies.has(args[0]!) ? this.replies.get(args[0]!) : [];
    }
}

test("reserved-name reads use ordered global Redis lists without realm prefixes or writes", async () => {
    const cache = new FakeCache();
    for (const key of keys)
    {
        cache.replies.set(key, [key]);
        expect(await cache.nicknameForbiddenWords(key)).toEqual([key]);
    }
    expect(cache.calls).toEqual(keys.map((key) => ["LRANGE", key, "0", "-1"]));
    for (const key of ["name", "forbidden_words_name\n", "forbidden_words_other", ""])
    {
        await expect(cache.nicknameForbiddenWords(key)).rejects.toThrow("nickname forbidden list");
    }
    expect(cache.calls).toHaveLength(5);
});

test("Redis pattern entries retain duplicates blanks and Java syntax without compiling or normalizing", async () => {
    const cache = new FakeCache();
    const input = ["", " (?i)SYNTHETIC ", "[", "", "\\Qliteral\\E", "中文"];
    cache.replies.set(keys[4]!, input);
    const patterns = await cache.nicknameForbiddenWords(keys[4]!);
    expect(patterns).toEqual(input);
    expect(patterns).not.toBe(input);
    input.push("changed");
    expect(patterns).toHaveLength(6);
});

test("list command failures retain the source empty-result fallback", async () => {
    const cache = new FakeCache();
    for (const key of keys)
    {
        cache.failures.add(key);
        expect(await cache.nicknameForbiddenWords(key)).toEqual([]);
    }
    expect(cache.calls).toHaveLength(5);
});

test("malformed or oversized list replies reject without exposing entries", async () => {
    const cache = new FakeCache();
    for (
        const reply of [
            null,
            undefined,
            false,
            "not a list",
            1,
            {},
            [null],
            [1],
            [Buffer.from("not a string")],
            ["a".repeat(65536)],
            ["中".repeat(21846)],
            Array(65537).fill(""),
            Array(257).fill("a".repeat(65535)),
        ]
    )
    {
        cache.replies.set(keys[4]!, reply);
        await expect(cache.nicknameForbiddenWords(keys[4]!)).rejects.toThrow(
            "nickname forbidden list",
        );
    }
    cache.replies.set(keys[4]!, ["a".repeat(65535)]);
    expect((await cache.nicknameForbiddenWords(keys[4]!))[0]).toHaveLength(65535);
    cache.replies.set(keys[4]!, Array(65536).fill(""));
    expect(await cache.nicknameForbiddenWords(keys[4]!)).toHaveLength(65536);
});

test("reserved-name reload reads all five lists only after appending the file entries", async () => {
    const calls: string[] = [];
    let filter: NicknameWordFilter;
    filter = new NicknameWordFilter(
        async () => {
            calls.push("file");
            return ["blocked"];
        },
        async (key) => {
            calls.push(key);
            expect(filter.contains("clear")).toBe(true);
            expect(filter.reservedNamePatterns()).toEqual([]);
            return [key];
        },
    );
    await filter.reload();
    expect(calls).toEqual(["file", ...keys]);
    expect(filter.contains("blocked")).toBe(true);
    expect(filter.contains("clear")).toBe(false);
    expect(filter.reservedNamePatterns()).toEqual([keys[4]!]);
});

test("a failed word-file read never reaches Redis or clears previously loaded patterns", async () => {
    let failed = false;
    let calls = 0;
    const filter = new NicknameWordFilter(
        async () => {
            if (failed)
            {
                throw new Error("Synthetic file failure");
            }
            return ["blocked"];
        },
        async () => {
            calls++;
            return ["^synthetic$"];
        },
    );
    await filter.reload();
    failed = true;
    await filter.reload();
    expect(calls).toBe(5);
    expect(filter.reservedNamePatterns()).toEqual(["^synthetic$"]);
    expect(filter.contains("blocked")).toBe(true);
    expect(filter.contains("clear")).toBe(false);
});

test("a reached reader failure keeps prior name patterns while preserving already-appended word entries", async () => {
    for (const failureAt of keys)
    {
        let content = ["old"];
        let failure = false;
        const calls: string[] = [];
        const filter = new NicknameWordFilter(
            async () => content,
            async (key) => {
                calls.push(key);
                if (failure && key === failureAt)
                {
                    throw new Error("Synthetic acquisition failure");
                }
                return [failure ? "new pattern" : "old pattern"];
            },
        );
        await filter.reload();
        failure = true;
        content = ["new"];
        calls.length = 0;
        await filter.reload();
        expect(calls).toEqual(keys.slice(0, keys.indexOf(failureAt) + 1));
        expect(filter.reservedNamePatterns()).toEqual(["old pattern"]);
        expect(filter.contains("old")).toBe(true);
        expect(filter.contains("new")).toBe(true);
        expect(filter.contains("clear")).toBe(false);
    }
});

test("successful empty list results replace previous patterns including a swallowed Redis failure", async () => {
    const cache = new FakeCache();
    cache.replies.set(keys[4]!, ["old pattern"]);
    const filter = new NicknameWordFilter(
        async () => ["blocked"],
        (key) => cache.nicknameForbiddenWords(key),
    );
    await filter.reload();
    expect(filter.reservedNamePatterns()).toEqual(["old pattern"]);
    cache.failures.add(keys[4]!);
    await filter.reload();
    expect(filter.reservedNamePatterns()).toEqual([]);
    expect(cache.calls).toHaveLength(10);
    expect(filter.contains("blocked")).toBe(true);
});

test("the old pattern snapshot remains available until the last list read finishes", async () => {
    let pending = false;
    let finish!: (patterns: string[]) => void;
    let entered!: () => void;
    const reachedLastList = new Promise<void>((resolve) => {
        entered = resolve;
    });
    const filter = new NicknameWordFilter(
        async () => ["blocked"],
        async (key) => {
            if (key === keys[4] && pending)
            {
                return new Promise<string[]>((resolve) => {
                    finish = resolve;
                    entered();
                });
            }
            return ["old pattern"];
        },
    );
    await filter.reload();
    pending = true;
    const reloading = filter.reload();
    await reachedLastList;
    expect(filter.reservedNamePatterns()).toEqual(["old pattern"]);
    expect(filter.contains("clear")).toBe(true);
    const source = ["new pattern", "new pattern"];
    finish(source);
    await reloading;
    source.push("external mutation");
    const snapshot = filter.reservedNamePatterns() as string[];
    snapshot.push("caller mutation");
    expect(filter.reservedNamePatterns()).toEqual(["new pattern", "new pattern"]);
    expect(filter.contains("clear")).toBe(false);
});

test("realm composition reads the real word file before Redis and exposes reserved patterns separately", async () => {
    const root = await mkdtemp(join(tmpdir(), "opencok-reserved-patterns-"));
    try
    {
        const wordsFile = join(root, "badwords.json");
        const cache = new FakeCache();
        cache.replies.set(keys[4]!, ["^reserved$", "["]);
        const absent = await loadNicknameServices(
            (key) => cache.nicknameForbiddenWords(key),
            wordsFile,
        );
        expect(absent.nicknameReservedPatterns!()).toEqual([]);
        expect(cache.calls).toEqual([]);
        await writeFile(wordsFile, JSON.stringify(["blocked"]));
        const services = await loadNicknameServices(
            (key) => cache.nicknameForbiddenWords(key),
            wordsFile,
        );
        expect(cache.calls).toEqual(keys.map((key) => ["LRANGE", key, "0", "-1"]));
        expect(services.nicknameReservedPatterns!()).toEqual(["^reserved$", "["]);
        expect(await services.nicknameBadWords!("blocked")).toBe(true);
        expect(await services.nicknameBadWords!("reserved")).toBe(false);
    }
    finally
    {
        await rm(root, { recursive: true, force: true });
    }
});
