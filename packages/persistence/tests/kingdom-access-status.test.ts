import { expect, test } from "bun:test";
import { KingdomAccessStatus } from "../src/enums/kingdom-access-status";
import {
    KingdomAccessStatusStore,
    kingdomAccessStatusKey,
} from "../src/stores/kingdom-access-status";

test("missing or corrupt status closes access and Redis failures propagate", async () => {
    let value: string | null = null;
    const store = new KingdomAccessStatusStore({
        get: async () => value,
        send: async () => "OK",
        del: async () => 1,
    });
    expect(await store.get(1)).toBe(KingdomAccessStatus.Closed);
    value = "unknown";
    expect(await store.get(1)).toBe(KingdomAccessStatus.Closed);
    for (const status of Object.values(KingdomAccessStatus))
    {
        value = status;
        expect(await store.get(1)).toBe(status);
    }
    const unavailable = new KingdomAccessStatusStore({
        get: async () => {
            throw new Error("Redis indisponível");
        },
        send: async () => {
            throw new Error("Redis indisponível");
        },
        del: async () => {
            throw new Error("Redis indisponível");
        },
    });
    await expect(unavailable.get(1)).rejects.toThrow("Redis indisponível");
    await expect(unavailable.set(1, KingdomAccessStatus.Open)).rejects.toThrow(
        "Redis indisponível",
    );
});

test("invalid kingdom, status and TTL never issue Redis commands", async () => {
    let calls = 0;
    const store = new KingdomAccessStatusStore({
        get: async () => {
            calls++;
            return null;
        },
        send: async () => {
            calls++;
            return "OK";
        },
        del: async () => {
            calls++;
            return 1;
        },
    });
    for (const id of [0, -1, 1.5, NaN, Infinity, 2147483648])
    {
        await expect(store.get(id)).rejects.toThrow();
        await expect(store.set(id, KingdomAccessStatus.Open)).rejects.toThrow();
        await expect(store.clear(id)).rejects.toThrow();
    }
    for (const ttl of [0, -1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])
    {
        await expect(store.set(1, KingdomAccessStatus.Open, ttl)).rejects.toThrow();
    }
    await expect(store.set(1, "unknown" as KingdomAccessStatus)).rejects.toThrow();
    expect(calls).toBe(0);
    expect(kingdomAccessStatusKey(1)).not.toBe(kingdomAccessStatusKey(2));
});
