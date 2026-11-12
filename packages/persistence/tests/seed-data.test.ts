import { expect, test } from "bun:test";
import { Mongoose } from "mongoose";
import { worldLayoutModel } from "@opencok/persistence/models/kingdom/world-layout";
import terrain from "../src/seeds/data/terrain-layout.json";

test("initial terrain data validates and matches the current read-only Realm terrain", async () => {
    const connection = new Mongoose().createConnection().useDb("kingdom_1");
    const Layout = worldLayoutModel(connection, 1);
    await expect(
        new Layout({
            ...terrain,
            worldPublicId: "b6f84dc5-cd4e-47cc-a3c7-82a67c0c84bd",
        }).validate(),
    ).resolves.toBeUndefined();
    const reference: { blocked: number[][]; columns: number; rows: number; } = await Bun.file(
        new URL(
            "../../../apps/realm/src/modules/world/terrain.json",
            import.meta.url,
        ),
    ).json();
    const expected = new Set(
        reference.blocked.map(([column, row]: number[]) => `${column},${row}`),
    );
    const actual = new Set(
        terrain.blockedCells.map(
            (cell) => `${cell.columnIndex},${cell.rowIndex}`,
        ),
    );
    expect(actual).toEqual(expected);
    expect(terrain.templateWidthInCells).toBe(reference.columns);
    expect(terrain.templateHeightInCells).toBe(reference.rows);
    expect(connection.readyState).toBe(0);
});
