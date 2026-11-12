import { worldPopulationConfigurationModel } from "../../src/models/kingdom/world-population-configuration";
import { ResourceSpawnJobStatus } from "../../src/enums/resource-spawn-job-status";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { connectMongoDB } from "../../src/mongoose";
import { createPostgresDataSource } from "../../src/factories/postgres-data-source";
import { worldRegionModel } from "../../src/models/kingdom/world-region";
import { worldResourceSpawnJobModel } from "../../src/models/kingdom/world-resource-spawn-job";
import { copyWorldDocuments } from "../../src/migrations/support/copy-world-documents";
import type { persistenceOptions } from "../../scripts/options";

export async function checkMongoWorldDocuments(
    options: ReturnType<typeof persistenceOptions>,
): Promise<number>
{
    const mongo = await connectMongoDB(options.mongodbUri, {
        dbName: "kingdom_1",
    });
    const sql = createPostgresDataSource("kingdom_1", options.postgres);
    const Region = worldRegionModel(mongo, 1);
    const Job = worldResourceSpawnJobModel(mongo, 1);
    const Population = worldPopulationConfigurationModel(mongo, 1);
    const populationIds: string[] = [];
    const regionIds: string[] = [];
    const jobIds: string[] = [];
    let checks = 0;
    async function reject(operation: () => Promise<unknown>, code: number)
    {
        let actual: number | undefined;
        try
        {
            await operation();
        }
        catch (error)
        {
            actual = (error as { code?: number; }).code;
        }
        assert.equal(actual, code);
        checks++;
    }
    const worldPublicId = "b6f84dc5-cd4e-47cc-a3c7-82a67c0c84bd";
    const baseRegion = {
        worldPublicId,
        displayName: "Database test",
        regionType: "resource_area",
        minimumCellX: 1,
        minimumCellY: 1,
        maximumCellX: 10,
        maximumCellY: 10,
    };
    try
    {
        const region = new Region(baseRegion);
        regionIds.push(String(region.publicId));
        await region.save();
        const invalidRegion = new Region({ ...baseRegion, maximumCellX: 0 });
        regionIds.push(String(invalidRegion.publicId));
        await reject(
            () => Region.collection.insertOne(invalidRegion.toObject()),
            121,
        );
        const invalidName = new Region({ ...baseRegion, displayName: " " });
        regionIds.push(String(invalidName.publicId));
        await reject(
            () => Region.collection.insertOne(invalidName.toObject()),
            121,
        );
        const baseJob = {
            worldRegionId: region._id,
            configurationPublicId: randomUUID(),
            eligibleAt: new Date(Date.now() - 60000),
        };
        for (
            const invalid of [
                { jobStatus: ResourceSpawnJobStatus.Processing },
                { jobStatus: ResourceSpawnJobStatus.Completed },
                { jobStatus: "failed" },
                { attemptCount: -1 },
            ]
        )
        {
            const document = new Job({ ...baseJob, ...invalid });
            jobIds.push(String(document.publicId));
            await reject(
                () => Job.collection.insertOne(document.toObject()),
                121,
            );
        }
        const sourceId = randomUUID();
        const job = new Job({ ...baseJob, sourceDepositPublicId: sourceId });
        jobIds.push(String(job.publicId));
        await job.save();
        const duplicate = new Job({
            ...baseJob,
            sourceDepositPublicId: sourceId,
        });
        jobIds.push(String(duplicate.publicId));
        await reject(() => duplicate.save(), 11000);
        const claimedAt = new Date();
        const claim = () =>
            Job.findOneAndUpdate(
                {
                    _id: job._id,
                    jobStatus: ResourceSpawnJobStatus.Pending,
                    deletedAt: null,
                    archivedAt: null,
                    eligibleAt: { $lte: claimedAt },
                },
                {
                    $set: {
                        jobStatus: ResourceSpawnJobStatus.Processing,
                        claimedAt,
                        claimExpiresAt: new Date(claimedAt.getTime() + 60000),
                    },
                    $inc: { attemptCount: 1 },
                },
                { returnDocument: "after", runValidators: true },
            ).exec();
        const claims = await Promise.all([claim(), claim()]);
        assert.equal(claims.filter(Boolean).length, 1);
        checks++;
        await reject(
            () =>
                Job.collection.updateOne(
                    { _id: job._id },
                    { $set: { attemptCount: -1 } },
                ),
            121,
        );
        await Job.updateOne(
            { _id: job._id },
            {
                $set: {
                    jobStatus: ResourceSpawnJobStatus.Completed,
                    claimExpiresAt: null,
                    completedAt: new Date(),
                    spawnedWorldObjectPublicId: worldPublicId,
                },
            },
            { runValidators: true },
        );
        const subsequent = new Job({
            ...baseJob,
            sourceDepositPublicId: sourceId,
        });
        jobIds.push(String(subsequent.publicId));
        await subsequent.save();
        checks++;
        const resourceId = randomUUID();
        const populationBase = {
            worldRegionId: region._id,
            configurationVersion: 1,
            maximumActiveDeposits: 10,
            populationCheckIntervalSeconds: 60,
            resourceRules: [
                { configurationPublicId: resourceId, targetActiveDeposits: 5 },
            ],
        };
        const population = new Population(populationBase);
        populationIds.push(String(population.publicId));
        await population.save();
        const sameVersion = new Population(populationBase);
        populationIds.push(String(sameVersion.publicId));
        await reject(() => sameVersion.save(), 11000);
        for (
            const invalid of [
                { maximumActiveDeposits: 4 },
                { populationCheckIntervalSeconds: 0 },
                { resourceRules: [] },
                {
                    resourceRules: [
                        {
                            configurationPublicId: resourceId,
                            targetActiveDeposits: 2,
                        },
                        {
                            configurationPublicId: resourceId,
                            targetActiveDeposits: 3,
                        },
                    ],
                },
            ]
        )
        {
            const candidate = new Population({
                ...populationBase,
                configurationVersion: 2,
                ...invalid,
            });
            populationIds.push(String(candidate.publicId));
            await reject(
                () => Population.collection.insertOne(candidate.toObject()),
                121,
            );
        }
        await reject(
            () =>
                Population.collection.updateOne(
                    { _id: population._id },
                    { $set: { maximumActiveDeposits: 1 } },
                ),
            121,
        );
        await Region.updateOne(
            { _id: region._id },
            { $set: { activePopulationConfigurationId: population._id } },
        );
        await reject(
            () =>
                Region.collection.updateOne(
                    { _id: region._id },
                    { $set: { regionType: "protected_area" } },
                ),
            121,
        );
        await sql.initialize();
        const runner = sql.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();
        try
        {
            await runner.query(
                `CREATE TEMP TABLE world_regions(id integer,public_id uuid,world_id integer,display_name text,region_type text,region_status text,minimum_cell_x integer,minimum_cell_y integer,maximum_cell_x integer,maximum_cell_y integer,created_at timestamptz,updated_at timestamptz,deleted_at timestamptz,archived_at timestamptz) ON COMMIT DROP`,
            );
            await runner.query(
                `CREATE TEMP TABLE world_resource_spawn_jobs(id integer,public_id uuid,world_region_id integer,source_deposit_id integer,configuration_public_id uuid,eligible_at timestamptz,job_status text,attempt_count integer,claimed_at timestamptz,claim_expires_at timestamptz,completed_at timestamptz,spawned_world_object_id integer,last_error text,created_at timestamptz,updated_at timestamptz,deleted_at timestamptz,archived_at timestamptz) ON COMMIT DROP`,
            );
            const copiedRegionId = randomUUID();
            const copiedJobId = randomUUID();
            regionIds.push(copiedRegionId);
            jobIds.push(copiedJobId);
            await runner.query(
                `INSERT INTO world_regions VALUES (42,$1,1,'Imported region','resource_area','disabled',1,1,100,100,'2025-01-01','2025-02-01',NULL,'2025-03-01')`,
                [copiedRegionId],
            );
            await runner.query(
                `INSERT INTO world_resource_spawn_jobs VALUES (43,$1,42,NULL,$2,'2025-04-01','cancelled',0,NULL,NULL,NULL,NULL,NULL,'2025-01-01','2025-02-01','2025-03-01',NULL)`,
                [copiedJobId, worldPublicId],
            );
            await copyWorldDocuments(runner, mongo, 1);
            const imported = await Region.findOne({
                publicId: copiedRegionId,
            }).orFail();
            const importedJob = await Job.findOne({
                publicId: copiedJobId,
            }).orFail();
            assert.equal(
                imported.archivedAt?.toISOString(),
                "2025-03-01T00:00:00.000Z",
            );
            assert.equal(
                importedJob.deletedAt?.toISOString(),
                "2025-03-01T00:00:00.000Z",
            );
            assert.equal(
                String(importedJob.worldRegionId),
                String(imported._id),
            );
            assert.equal(
                imported.createdAt.toISOString(),
                "2025-01-01T00:00:00.000Z",
            );
            checks += 4;
            await copyWorldDocuments(runner, mongo, 1);
            assert.equal(
                await Region.countDocuments({ publicId: copiedRegionId }),
                1,
            );
            assert.equal(
                await Job.countDocuments({ publicId: copiedJobId }),
                1,
            );
            checks += 2;
            await Region.updateOne(
                { publicId: copiedRegionId },
                { $set: { displayName: "Changed" } },
            );
            await assert.rejects(
                () => copyWorldDocuments(runner, mongo, 1),
                /diverge/,
            );
            assert.equal(
                (await runner.query("SELECT count(*) FROM world_regions"))[0]
                    .count,
                "1",
            );
            checks += 2;
        }
        finally
        {
            await runner.rollbackTransaction();
            await runner.release();
        }
        return checks;
    }
    finally
    {
        try
        {
            await Population.deleteMany({ publicId: { $in: populationIds } });
            await Job.deleteMany({ publicId: { $in: jobIds } });
            await Region.deleteMany({ publicId: { $in: regionIds } });
        }
        finally
        {
            await mongo.close();
            if (sql.isInitialized)
            {
                await sql.destroy();
            }
        }
    }
}
