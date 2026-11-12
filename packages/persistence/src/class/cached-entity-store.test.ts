import { describe, expect, test } from "bun:test";
import { CachedEntityStore } from "./cached-entity-store";
import type { EntityStore } from "../interfaces/repository";
import type { EntityCache } from "../interfaces/cache";

type Row = { publicId: number; name: string; };
type Input = { name: string; };

function fixture()
{
    const events: string[] = [];
    const row: Row = { publicId: 7, name: "kingdom" };
    const page = { items: [row], offset: 0, limit: 1, hasMore: false };
    const store: EntityStore<Row, Input, Partial<Input>> = {
        findByPublicId: async publicId => {
            events.push(`find:${publicId}`);
            return row;
        },
        list: async query => {
            events.push(`list:${query.offset}:${query.limit}`);
            return page;
        },
        create: async input => {
            events.push(`create:${input.name}`);
            return row;
        },
        update: async (publicId, patch) => {
            events.push(`update:${publicId}:${patch.name}`);
            return row;
        },
        softDelete: async publicId => {
            events.push(`delete:${publicId}`);
            return true;
        },
    };
    const cache: EntityCache<Row> = {
        remember: async (publicId, load) => {
            events.push(`remember:${publicId}`);
            return load();
        },
        invalidate: async publicId => {
            events.push(`invalidate:${publicId}`);
        },
    };
    return { store, cache, events, row, page, cached: new CachedEntityStore(store, cache) };
}

describe("cached entity store", () => {
    test("lookups delegate through the cache and list bypasses it", async () => {
        const { cached, events, row, page } = fixture();
        expect(await cached.findByPublicId("7")).toBe(row);
        expect(await cached.list({ offset: 0, limit: 1 })).toBe(page);
        expect(events).toEqual(["remember:7", "find:7", "list:0:1"]);
    });

    test("cache hits do not access the store", async () => {
        const { cached, cache, events, row } = fixture();
        cache.remember = async () => row;
        expect(await cached.findByPublicId("7")).toBe(row);
        expect(events).toEqual([]);
    });

    test("successful writes invalidate only after persistence and preserve results", async () => {
        const { cached, events, row } = fixture();
        expect(await cached.create({ name: "new" })).toBe(row);
        expect(await cached.update("7", { name: "updated" })).toBe(row);
        expect(await cached.softDelete("7")).toBe(true);
        expect(events).toEqual([
            "create:new",
            "invalidate:7",
            "update:7:updated",
            "invalidate:7",
            "delete:7",
            "invalidate:7",
        ]);
    });

    test("missing rows are still invalidated after update and deletion", async () => {
        const { cached, store, events } = fixture();
        store.update = async () => null;
        store.softDelete = async () => false;
        expect(await cached.update("absent", {})).toBeNull();
        expect(await cached.softDelete("absent")).toBe(false);
        expect(events).toEqual(["invalidate:absent", "invalidate:absent"]);
    });

    test("failed writes propagate without invalidating", async () => {
        const { cached, store, events } = fixture();
        const failure = new Error("write rejected");
        const reject = async () => {
            throw failure;
        };
        store.create = reject;
        store.update = reject;
        store.softDelete = reject;
        await expect(cached.create({ name: "new" })).rejects.toBe(failure);
        await expect(cached.update("7", {})).rejects.toBe(failure);
        await expect(cached.softDelete("7")).rejects.toBe(failure);
        expect(events).toEqual([]);
    });

    test("invalidation failures are not silently swallowed by the wrapper", async () => {
        const { cached, cache, events } = fixture();
        const failure = new Error("invalidation rejected");
        cache.invalidate = async () => {
            throw failure;
        };
        await expect(cached.create({ name: "new" })).rejects.toBe(failure);
        expect(events).toEqual(["create:new"]);
    });
});
