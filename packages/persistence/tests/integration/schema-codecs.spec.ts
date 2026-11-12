import { afterAll, describe, expect, test } from "vitest";
import { Mongoose, Types } from "mongoose";
import { mongoCacheCodec, postgresCacheCodec } from "../../src/cache/codecs";
import { worldLayoutModel } from "../../src/models/kingdom/world-layout";

const publicId = "b6f84dc5-cd4e-47cc-a3c7-82a67c0c84bd";
const worldPublicId = "46c04962-5fc0-4f1d-a5f6-0ae8ac7c6e20";
const createdAt = new Date("2026-01-01T00:00:00.000Z");
const mongoose = new Mongoose();
const connection = mongoose.createConnection().useDb("kingdom_1");
const Layout = worldLayoutModel(connection, 1);
const layout = {
    publicId,
    worldPublicId,
    layoutVersion: 1,
    templateWidthInCells: 2,
    templateHeightInCells: 2,
    blockedCells: [{ columnIndex: 1, rowIndex: 1 }],
    createdAt,
};

class CacheRow
{
    id = 1;
    publicId = publicId;
    createdAt = createdAt;
    updatedAt = createdAt;
    deletedAt: Date | null = null;
    archivedAt: Date | null = null;
    depletedAt: Date | null = null;
    quantity = "9223372036854775807";
}

afterAll(async () => {
    await mongoose.disconnect();
});

describe("offline schema and codec integration, no database connections", () => {
    test("model binding reuses only the corresponding kingdom's model", () => {
        expect(worldLayoutModel(connection, 1)).toBe(Layout);
        expect(() => worldLayoutModel(connection, 2)).toThrow();
        const other = mongoose.createConnection().useDb("kingdom_2");
        expect(worldLayoutModel(other, 2)).not.toBe(Layout);
        expect(connection.readyState).toBe(0);
        expect(other.readyState).toBe(0);
        expect(Layout.schema.options.autoCreate).toBe(false);
        expect(Layout.schema.options.autoIndex).toBe(false);
        expect(Layout.schema.options.bufferCommands).toBe(false);
    });

    test("document validation runs embedded coordinate and layout hooks without I/O", async () => {
        await expect(new Layout(layout).validate()).resolves.toBeUndefined();
        for (
            const blockedCells of [
                [{ columnIndex: 2, rowIndex: 0 }],
                [{ columnIndex: 0, rowIndex: 2 }],
                [{ columnIndex: -1, rowIndex: 0 }],
                [{ columnIndex: 0.5, rowIndex: 0 }],
                [{ columnIndex: 0, rowIndex: 0 }, { columnIndex: 0, rowIndex: 0 }],
            ]
        )
        {
            await expect(new Layout({ ...layout, blockedCells }).validate()).rejects.toThrow();
        }
        expect(() => new Layout({ ...layout, ignoredLegacyField: true })).toThrow();
        expect(connection.readyState).toBe(0);
    });

    test("Mongo codec preserves BSON identity, UUID subtype, dates and embedded cells", async () => {
        const document = new Layout(layout);
        await document.validate();
        const codec = mongoCacheCodec(Layout);
        const encoded = codec.encode(document);
        const restored = codec.decode(encoded);
        expect(restored).not.toBe(document);
        expect(restored._id).toBeInstanceOf(Types.ObjectId);
        expect(restored._id.equals(document._id)).toBe(true);
        expect(String(restored.publicId)).toBe(publicId);
        expect(String(restored.worldPublicId)).toBe(worldPublicId);
        expect(restored.createdAt).toEqual(createdAt);
        expect(restored.createdAt).toBeInstanceOf(Date);
        expect(restored.toObject({ getters: false })).toEqual(
            document.toObject({ getters: false }),
        );
        expect(restored.blockedCells[0]?.columnIndex).toBe(1);
        expect(codec.encode(restored)).toBe(encoded);
        await expect(restored.validate()).resolves.toBeUndefined();
        expect(connection.readyState).toBe(0);
    });

    test("SQL codec rehydrates a constructor without importing decorated TypeORM entities", () => {
        const codec = postgresCacheCodec(() => new CacheRow());
        const row = new CacheRow();
        row.deletedAt = new Date("2026-01-02T00:00:00.000Z");
        row.archivedAt = new Date("2026-01-03T00:00:00.000Z");
        row.depletedAt = new Date("2026-01-04T00:00:00.000Z");
        const restored = codec.decode(codec.encode(row));
        expect(restored).toBeInstanceOf(CacheRow);
        expect(restored).toEqual(row);
        expect(restored.quantity).toBe("9223372036854775807");
        for (const field of ["createdAt", "updatedAt", "deletedAt", "archivedAt", "depletedAt"])
        {
            expect(Reflect.get(restored, field)).toBeInstanceOf(Date);
        }
        const active = codec.decode(codec.encode(new CacheRow()));
        expect(active.deletedAt).toBeNull();
        expect(active.archivedAt).toBeNull();
        expect(active.depletedAt).toBeNull();
        expect(() => codec.decode("not JSON")).toThrow(SyntaxError);
    });
});
