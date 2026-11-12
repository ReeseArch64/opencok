import type { MigrationInterface, QueryRunner } from "typeorm";
import { connectRedis } from "../../redis";
import { KingdomAccessStatusStore } from "../../stores/kingdom-access-status";
import { KingdomAccessStatus } from "../../enums/kingdom-access-status";
import { migrationRedisUris } from "../support/redis-uri";

export class MoveKingdomAccessStatusToRedis1794438008000 implements MigrationInterface
{
    name = "MoveKingdomAccessStatusToRedis1794438008000";

    async up(queryRunner: QueryRunner): Promise<void>
    {
        const client = await connectRedis(migrationRedisUris.get(queryRunner.connection));
        try
        {
            const store = new KingdomAccessStatusStore(client);
            const kingdoms: { id: number; accessStatus: KingdomAccessStatus; }[] = await queryRunner
                .query(
                    "SELECT \"id\", \"access_status\"::text AS \"accessStatus\" FROM \"kingdoms\" WHERE \"deleted_at\" IS NULL AND \"archived_at\" IS NULL",
                );
            for (const kingdom of kingdoms)
            {
                await store.set(kingdom.id, kingdom.accessStatus, undefined, true);
            }
            await queryRunner.query("ALTER TABLE \"kingdoms\" DROP COLUMN \"access_status\"");
            await queryRunner.query("DROP TYPE \"public\".\"kingdom_access_status\"");
        }
        finally
        {
            client.close();
        }
    }

    async down(queryRunner: QueryRunner): Promise<void>
    {
        const client = await connectRedis(migrationRedisUris.get(queryRunner.connection));
        try
        {
            const store = new KingdomAccessStatusStore(client);
            await queryRunner.query(
                `CREATE TYPE "public"."kingdom_access_status" AS ENUM ('closed', 'open', 'maintenance', 'full')`,
            );
            await queryRunner.query(
                `ALTER TABLE "kingdoms" ADD COLUMN "access_status" "public"."kingdom_access_status" NOT NULL DEFAULT 'closed'`,
            );
            const kingdoms: { id: number; }[] = await queryRunner.query(
                "SELECT \"id\" FROM \"kingdoms\" WHERE \"deleted_at\" IS NULL AND \"archived_at\" IS NULL",
            );
            for (const kingdom of kingdoms)
            {
                await queryRunner.query(
                    "UPDATE \"kingdoms\" SET \"access_status\" = $1 WHERE \"id\" = $2",
                    [await store.get(kingdom.id), kingdom.id],
                );
            }
        }
        finally
        {
            client.close();
        }
    }
}
