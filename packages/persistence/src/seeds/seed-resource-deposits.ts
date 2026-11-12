import type { Connection } from "mongoose";
import type { DataSource } from "typeorm";
import { WorldObject } from "../models/kingdom/world-object";
import { WorldResourceDeposit } from "../models/kingdom/world-resource-deposit";
import { resourceDepositConfigurationModel } from "../models/global/resource-deposit-configuration";
import { ResourceType } from "../enums/resource-type";
import { WorldObjectType } from "../enums/world-object-type";
import { ResourceDepositStatus } from "../enums/resource-deposit-status";

export async function seedResourceDeposits(
    source: DataSource,
    mongo: Connection,
): Promise<void>
{
    const Configuration = resourceDepositConfigurationModel(mongo);
    await source.transaction(async (manager) => {
        await manager.query(
            "SELECT pg_advisory_xact_lock(hashtext('opencok.seed.resource-deposits'))",
        );
        const candidates = [
            {
                objectId: 2,
                objectType: WorldObjectType.WoodResource,
                resourceType: ResourceType.Wood,
            },
            {
                objectId: 3,
                objectType: WorldObjectType.FoodResource,
                resourceType: ResourceType.Food,
            },
        ];
        for (const candidate of candidates)
        {
            const object = await manager
                .getRepository(WorldObject)
                .createQueryBuilder("object")
                .where("object.id = :id", { id: candidate.objectId })
                .setLock("pessimistic_write")
                .getOne();
            if (
                !object
                || object.archivedAt
                || object.worldId !== 1
                || object.objectType !== candidate.objectType
            )
            {
                continue;
            }
            const existing = await manager
                .getRepository(WorldResourceDeposit)
                .findOne({
                    where: { worldObjectId: object.id },
                    withDeleted: true,
                });
            if (existing)
            {
                continue;
            }
            const configuration = await Configuration.findOne({
                resourceType: candidate.resourceType,
                resourceLevel: object.level,
                configurationVersion: 1,
            }).orFail();
            const quantity = String(configuration.initialQuantity);
            await manager
                .createQueryBuilder()
                .insert()
                .into(WorldResourceDeposit)
                .values({
                    worldObjectId: object.id,
                    resourceType: candidate.resourceType,
                    configurationPublicId: String(configuration.publicId),
                    initialQuantity: quantity,
                    remainingQuantity: quantity,
                    depositStatus: ResourceDepositStatus.Available,
                    depletedAt: null,
                })
                .orIgnore()
                .execute();
        }
    });
}
