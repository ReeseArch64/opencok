import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddKingdomFullStatus1794438003000 implements MigrationInterface
{
    name = "AddKingdomFullStatus1794438003000";

    async up(queryRunner: QueryRunner): Promise<void>
    {
        await queryRunner.query(
            `ALTER TYPE "public"."kingdom_access_status" ADD VALUE IF NOT EXISTS 'full' AFTER 'maintenance'`,
        );
    }

    async down(queryRunner: QueryRunner): Promise<void>
    {
        const fullKingdoms = await queryRunner.query(
            `SELECT 1 FROM "kingdoms" WHERE "access_status"::text = 'full' LIMIT 1`,
        );
        if (fullKingdoms.length)
        {
            throw new Error(
                "Não é possível reverter enquanto houver reinos com status full",
            );
        }
        await queryRunner.query(
            "ALTER TABLE \"kingdoms\" ALTER COLUMN \"access_status\" DROP DEFAULT",
        );
        await queryRunner.query(
            "ALTER TYPE \"public\".\"kingdom_access_status\" RENAME TO \"kingdom_access_status_with_full\"",
        );
        await queryRunner.query(
            `CREATE TYPE "public"."kingdom_access_status" AS ENUM ('closed', 'open', 'maintenance')`,
        );
        await queryRunner.query(
            "ALTER TABLE \"kingdoms\" ALTER COLUMN \"access_status\" TYPE \"public\".\"kingdom_access_status\" USING \"access_status\"::text::\"public\".\"kingdom_access_status\"",
        );
        await queryRunner.query(
            `ALTER TABLE "kingdoms" ALTER COLUMN "access_status" SET DEFAULT 'closed'`,
        );
        await queryRunner.query(
            "DROP TYPE \"public\".\"kingdom_access_status_with_full\"",
        );
    }
}
