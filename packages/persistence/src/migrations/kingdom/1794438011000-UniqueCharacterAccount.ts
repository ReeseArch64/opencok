import type { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueCharacterAccount1794438011000 implements MigrationInterface
{
    name = "UniqueCharacterAccount1794438011000";
    async up(queryRunner: QueryRunner): Promise<void>
    {
        await queryRunner.query("DROP INDEX \"character_account\"");
        await queryRunner.query(
            "CREATE UNIQUE INDEX \"character_account\" ON \"characters\" (\"account_public_id\")",
        );
    }
    async down(queryRunner: QueryRunner): Promise<void>
    {
        await queryRunner.query("DROP INDEX \"character_account\"");
        await queryRunner.query(
            "CREATE INDEX \"character_account\" ON \"characters\" (\"account_public_id\")",
        );
    }
}
