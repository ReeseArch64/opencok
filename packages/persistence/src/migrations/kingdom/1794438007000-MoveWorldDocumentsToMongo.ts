import type { MigrationInterface, QueryRunner } from "typeorm";
import { migrationMongoConnections } from "../support/mongo-connections";
import { copyWorldDocuments } from "../support/copy-world-documents";

export class MoveWorldDocumentsToMongo1794438007000 implements MigrationInterface
{
    name = "MoveWorldDocumentsToMongo1794438007000";
    async up(queryRunner: QueryRunner): Promise<void>
    {
        const mongo = migrationMongoConnections.get(queryRunner.connection);
        if (!mongo)
        {
            throw new Error(
                "Use bun run migrate com --mongodb-uri para verificar a cópia antes de remover as tabelas SQL",
            );
        }
        const match = /^kingdom_([1-9][0-9]*)$/.exec(
            String(queryRunner.connection.options.database),
        );
        if (!match)
        {
            throw new Error("Banco de reino inválido");
        }
        await copyWorldDocuments(queryRunner, mongo, Number(match[1]));
        await queryRunner.query("DROP TABLE world_resource_spawn_jobs");
        await queryRunner.query("DROP TABLE world_regions");
        await queryRunner.query("DROP TYPE public.resource_spawn_job_status");
        await queryRunner.query("DROP TYPE public.world_region_status");
        await queryRunner.query("DROP TYPE public.world_region_type");
    }
    async down(): Promise<void>
    {
        throw new Error(
            "A reversão exige uma transferência explícita dos documentos MongoDB para SQL; não será criada uma cópia SQL vazia",
        );
    }
}
