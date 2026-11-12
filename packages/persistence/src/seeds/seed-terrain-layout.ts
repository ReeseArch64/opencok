import type { Connection } from "mongoose";
import { worldLayoutModel } from "../models/kingdom/world-layout";
import layout from "./data/terrain-layout.json";

export async function seedTerrainLayout(
    connection: Connection,
    worldPublicId: string,
): Promise<void>
{
    const Layout = worldLayoutModel(connection, 1);
    await Layout.createCollection();
    await Layout.createIndexes();
    const document = new Layout({ ...layout, worldPublicId });
    await document.validate();
    await Layout.updateOne(
        { worldPublicId, layoutVersion: layout.layoutVersion },
        { $setOnInsert: document.toObject() },
        { upsert: true, runValidators: true },
    );
}
