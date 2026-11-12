import { expect, test } from "bun:test";
import { Mongoose, Types } from "mongoose";
import { getMetadataArgsStorage } from "typeorm";
import { BaseEntity } from "@opencok/persistence/base/base-entity";
import {
    City,
    CharacterResources,
    Account,
    CharacterProvisioning,
    Character,
    Kingdom,
    World,
    WorldObject,
    WorldResourceDeposit,
    WorldObjectCell,
} from "@opencok/persistence";
import { worldLayoutModel } from "@opencok/persistence/models/kingdom/world-layout";

const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const worldPublicId = "b6f84dc5-cd4e-47cc-a3c7-82a67c0c84bd";
const mongoose = new Mongoose();
const connection = mongoose.createConnection().useDb("kingdom_1");
const Layout = worldLayoutModel(connection, 1);
const layout = {
    worldPublicId,
    layoutVersion: 1,
    templateWidthInCells: 57,
    templateHeightInCells: 57,
};

test("SQL models retain numeric primary keys and declare independent UUID public identities", () => {
    const metadata = getMetadataArgsStorage();
    for (
        const model of [
            Account,
            CharacterProvisioning,
            City,
            CharacterResources,
            Character,
            Kingdom,
            World,
            WorldObject,
            WorldResourceDeposit,
            WorldObjectCell,
        ]
    )
    {
        const columns = metadata.columns.filter(
            (column) => column.target === model || column.target === BaseEntity,
        );
        const id = columns.find((column) => column.propertyName === "id");
        expect(id?.options.type).toBe("integer");
        expect(id?.options.primary).toBe(true);
        const publicId = columns.find(
            (column) => column.propertyName === "publicId",
        );
        expect(publicId?.options).toMatchObject({
            name: "public_id",
            type: "uuid",
            unique: true,
            update: false,
        });
        expect((publicId!.options.default as () => string)()).toBe(
            "gen_random_uuid()",
        );
    }
});

test("MongoDB generates ObjectId and UUID independently and serializes UUID as BSON subtype 4", async () => {
    const first = new Layout(layout);
    const second = new Layout(layout);
    await first.validate();
    await second.validate();
    expect(first._id).toBeInstanceOf(Types.ObjectId);
    expect(first._id.equals(second._id)).toBe(false);
    expect(String(first.publicId)).toMatch(uuidV4);
    expect(String(first.publicId)).not.toBe(String(second.publicId));
    const raw = first.toObject({ getters: false });
    expect(raw.publicId).toBeInstanceOf(Types.UUID);
    expect(raw.publicId.sub_type).toBe(4);
    expect(String(first.worldPublicId)).toBe(worldPublicId);
});

test("MongoDB rejects invalid UUID identities and preserves publicId after creation", async () => {
    for (const publicId of ["invalid", "", null, 42])
    {
        await expect(
            new Layout({ ...layout, publicId }).validate(),
        ).rejects.toThrow();
    }
    await expect(
        new Layout({ ...layout, worldPublicId: "invalid" }).validate(),
    ).rejects.toThrow();
    const document = new Layout(layout);
    const original = String(document.publicId);
    document.isNew = false;
    document.set("publicId", "42491e94-faa1-4fef-b7e6-6514c0a67db5");
    expect(String(document.publicId)).toBe(original);
    expect(connection.readyState).toBe(0);
});
