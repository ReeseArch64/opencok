import type { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateWorldObjectTypes1794438002000 implements MigrationInterface
{
    name = "UpdateWorldObjectTypes1794438002000";

    async up(queryRunner: QueryRunner): Promise<void>
    {
        await queryRunner.query(`DELETE FROM "world_objects"
            WHERE "id" = 4 AND "world_id" = 1 AND "object_type" = 'central_monument'
              AND "cell_x" = 596 AND "cell_y" = 596
              AND "width_in_cells" = 10 AND "height_in_cells" = 10 AND "level" = 0`);
        const remaining = await queryRunner.query(
            `SELECT 1 FROM "world_objects" WHERE "object_type" = 'central_monument' LIMIT 1`,
        );
        if (remaining.length)
        {
            throw new Error(
                "Há objetos central_monument diferentes do seed inicial; a migração foi cancelada para preservá-los",
            );
        }

        await queryRunner.query(
            "ALTER TYPE \"public\".\"world_object_type\" RENAME TO \"world_object_type_previous\"",
        );
        await queryRunner.query(
            `CREATE TYPE "public"."world_object_type" AS ENUM ('castle', 'wood_resource', 'food_resource', 'iron_resource', 'mithril_resource', 'ancient_ruins', 'gold_mine', 'refined_iron_resource')`,
        );
        await queryRunner.query(
            "ALTER TABLE \"world_objects\" ALTER COLUMN \"object_type\" TYPE \"public\".\"world_object_type\" USING \"object_type\"::text::\"public\".\"world_object_type\"",
        );
        await queryRunner.query(
            "DROP TYPE \"public\".\"world_object_type_previous\"",
        );
    }

    async down(queryRunner: QueryRunner): Promise<void>
    {
        const unsupported = await queryRunner.query(
            `SELECT 1 FROM "world_objects" WHERE "object_type"::text NOT IN ('castle', 'wood_resource', 'food_resource') LIMIT 1`,
        );
        if (unsupported.length)
        {
            throw new Error(
                "Não é possível reverter enquanto existirem objetos dos novos tipos",
            );
        }
        await queryRunner.query(
            "ALTER TYPE \"public\".\"world_object_type\" RENAME TO \"world_object_type_expanded\"",
        );
        await queryRunner.query(
            `CREATE TYPE "public"."world_object_type" AS ENUM ('castle', 'wood_resource', 'food_resource', 'central_monument')`,
        );
        await queryRunner.query(
            "ALTER TABLE \"world_objects\" ALTER COLUMN \"object_type\" TYPE \"public\".\"world_object_type\" USING \"object_type\"::text::\"public\".\"world_object_type\"",
        );
        await queryRunner.query(
            "DROP TYPE \"public\".\"world_object_type_expanded\"",
        );
    }
}
