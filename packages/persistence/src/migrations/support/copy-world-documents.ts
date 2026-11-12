import { isDeepStrictEqual } from "node:util";
import type { Connection } from "mongoose";
import type { QueryRunner } from "typeorm";
import { worldRegionModel } from "../../models/kingdom/world-region";
import { worldResourceSpawnJobModel } from "../../models/kingdom/world-resource-spawn-job";
import { prepareWorldDocuments } from "../../seeds/prepare-world-documents";

export async function copyWorldDocuments(
    runner: QueryRunner,
    mongo: Connection,
    kingdomId: number,
): Promise<void>
{
    await runner.query(
        "LOCK TABLE world_regions,world_resource_spawn_jobs IN ACCESS EXCLUSIVE MODE",
    );
    await prepareWorldDocuments(mongo, kingdomId);
    const Region = worldRegionModel(mongo, kingdomId);
    const Job = worldResourceSpawnJobModel(mongo, kingdomId);
    const regions = await runner.query(
        "SELECT r.*,w.public_id AS world_public_id FROM world_regions r JOIN worlds w ON w.id=r.world_id ORDER BY r.id",
    );
    const normalize = (value: unknown): unknown =>
        value instanceof Date
            ? value.toISOString()
            : value !== null && typeof value === "object"
            ? String(value)
            : value;
    function verify(
        expected: Record<string, unknown>,
        stored: Record<string, unknown>,
    )
    {
        for (const [key, value] of Object.entries(expected))
        {
            if (key === "_id" || key === "__v")
            {
                continue;
            }
            if (!isDeepStrictEqual(normalize(value), normalize(stored[key])))
            {
                throw new Error(
                    `Documento existente diverge do PostgreSQL no campo ${key}; nada foi apagado do SQL`,
                );
            }
        }
    }
    const regionIds = new Map<number, unknown>();
    for (const row of regions)
    {
        const document = new Region({
            publicId: row.public_id,
            worldPublicId: row.world_public_id,
            displayName: row.display_name,
            regionType: row.region_type,
            regionStatus: row.region_status,
            minimumCellX: row.minimum_cell_x,
            minimumCellY: row.minimum_cell_y,
            maximumCellX: row.maximum_cell_x,
            maximumCellY: row.maximum_cell_y,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            deletedAt: row.deleted_at,
            archivedAt: row.archived_at,
        });
        await document.validate();
        const raw = document.toObject();
        await Region.collection.updateOne(
            { publicId: raw.publicId },
            { $setOnInsert: raw },
            { upsert: true },
        );
        const stored = await Region.findOne({
            publicId: row.public_id,
        }).orFail();
        verify(raw, stored.toObject());
        regionIds.set(row.id, stored._id);
    }
    const jobs = await runner.query(
        "SELECT j.*,d.public_id AS source_public_id,o.public_id AS result_public_id FROM world_resource_spawn_jobs j LEFT JOIN world_resource_deposits d ON d.id=j.source_deposit_id LEFT JOIN world_objects o ON o.id=j.spawned_world_object_id ORDER BY j.id",
    );
    for (const row of jobs)
    {
        const regionId = regionIds.get(row.world_region_id);
        if (!regionId)
        {
            throw new Error("Região de origem não foi copiada");
        }
        const document = new Job({
            publicId: row.public_id,
            worldRegionId: regionId,
            sourceDepositPublicId: row.source_public_id,
            configurationPublicId: row.configuration_public_id,
            eligibleAt: row.eligible_at,
            jobStatus: row.job_status,
            attemptCount: row.attempt_count,
            claimedAt: row.claimed_at,
            claimExpiresAt: row.claim_expires_at,
            completedAt: row.completed_at,
            spawnedWorldObjectPublicId: row.result_public_id,
            lastError: row.last_error,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            deletedAt: row.deleted_at,
            archivedAt: row.archived_at,
        });
        await document.validate();
        const raw = document.toObject();
        await Job.collection.updateOne(
            { publicId: raw.publicId },
            { $setOnInsert: raw },
            { upsert: true },
        );
        const stored = await Job.findOne({ publicId: row.public_id }).orFail();
        verify(raw, stored.toObject());
    }
}
