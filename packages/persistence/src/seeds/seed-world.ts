import type { Connection } from "mongoose";
import type { DataSource } from "typeorm";
import { World } from "../models/kingdom/world";
import { WorldObject } from "../models/kingdom/world-object";
import { WorldObjectType } from "../enums/world-object-type";
import { advanceIdentity } from "./advance-identity";
import { seedTerrainLayout } from "./seed-terrain-layout";

export async function seedWorld(
    source: DataSource,
    mongo: Connection,
): Promise<void>
{
    await source.transaction(async (manager) => {
        await manager.query(
            "SELECT pg_advisory_xact_lock(hashtext('opencok.seed.world'))",
        );
        const result = await manager
            .createQueryBuilder()
            .insert()
            .into(World)
            .values({
                id: 1,
                publicId: "b6f84dc5-cd4e-47cc-a3c7-82a67c0c84bd",
                widthInCells: 1200,
                heightInCells: 1200,
                activeTerrainLayoutVersion: 1,
            })
            .orIgnore()
            .returning("id")
            .execute();
        const world = await manager
            .getRepository(World)
            .findOne({ where: { id: 1 }, withDeleted: true });
        if (!world || world.deletedAt || world.archivedAt)
        {
            throw new Error(
                "O mundo inicial está ausente, excluído ou arquivado",
            );
        }
        if (world.activeTerrainLayoutVersion === 1)
        {
            await seedTerrainLayout(mongo, world.publicId);
        }
        if (result.raw.length > 0)
        {
            await manager
                .createQueryBuilder()
                .insert()
                .into(WorldObject)
                .values([
                    {
                        id: 1,
                        worldId: 1,
                        objectType: WorldObjectType.Castle,
                        cellX: 570,
                        cellY: 570,
                        widthInCells: 2,
                        heightInCells: 2,
                        level: 1,
                    },
                    {
                        id: 2,
                        worldId: 1,
                        objectType: WorldObjectType.WoodResource,
                        cellX: 567,
                        cellY: 570,
                        widthInCells: 1,
                        heightInCells: 1,
                        level: 1,
                    },
                    {
                        id: 3,
                        worldId: 1,
                        objectType: WorldObjectType.FoodResource,
                        cellX: 573,
                        cellY: 570,
                        widthInCells: 1,
                        heightInCells: 1,
                        level: 1,
                    },
                ])
                .execute();
        }
        await advanceIdentity(manager, "worlds");
        await advanceIdentity(manager, "world_objects");
    });
}
