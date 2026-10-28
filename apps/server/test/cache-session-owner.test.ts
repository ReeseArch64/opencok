import { test, expect } from "bun:test";
import { Cache } from "@opencok/storage/session";
class SessionCache extends Cache
{
    calls: { command: string; args: string[]; }[] = [];
    override async command(command: string, ...args: string[]): Promise<unknown>
    {
        this.calls.push({ command, args });
        return command === "SET" ? "OK" : 1;
    }
}
const config = { redisUrl: "redis://127.0.0.1:1", timeoutMs: 1000, kingdomId: 7 };
test("owned Redis sessions share one epoch key across claim, refresh and token-checked release", async () => {
    const cache = new SessionCache(config);
    cache.bindRealmOwner(19n);
    expect(await cache.claim("owner", "synthetic-token")).toBe(true);
    expect(await cache.refresh("owner", "synthetic-token")).toBe(true);
    await cache.release("owner", "synthetic-token");
    expect(cache.calls[0]!.args).toEqual([
        "opencok:kingdom:7:owner:19:session:owner",
        "synthetic-token",
        "NX",
        "EX",
        "120",
    ]);
    expect(cache.calls[1]!.args.slice(2)).toEqual([
        "opencok:kingdom:7:owner:19:session:owner",
        "synthetic-token",
        "120",
    ]);
    expect(cache.calls[2]!.args.slice(2)).toEqual([
        "opencok:kingdom:7:owner:19:session:owner",
        "synthetic-token",
    ]);
    const successor = new SessionCache(config);
    successor.bindRealmOwner(20n);
    await successor.claim("owner", "synthetic-successor");
    expect(successor.calls[0]!.args[0]).toBe("opencok:kingdom:7:owner:20:session:owner");
});
test("a session cache cannot change its bound realm epoch or accept an invalid epoch", () => {
    for (const epoch of [0n, -1n, 9223372036854775808n])
    {
        expect(() => new SessionCache(config).bindRealmOwner(epoch)).toThrow();
    }
    const cache = new SessionCache(config);
    cache.bindRealmOwner(1n);
    expect(() => cache.bindRealmOwner(1n)).toThrow();
    expect(() => cache.bindRealmOwner(2n)).toThrow();
});
