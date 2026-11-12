import { expect, test } from "bun:test";
import { DataSource } from "typeorm";
import { BaseEntity } from "@opencok/persistence/base/base-entity";
import {
    City,
    CharacterResources,
    Account,
    CharacterProvisioning,
    Character,
    Kingdom,
    World,
    WorldObject,
    WorldResourceDeposit,
    WorldObjectCell,
    CityBuilding,
    ConstructionJob,
    CommandReceipt,
    EconomyPosting,
    MutationOutbox,
} from "@opencok/persistence";
import { createPostgresDataSource } from "@opencok/persistence/factories/postgres-data-source";

class MetadataDataSource extends DataSource
{
    async prepareMetadata(): Promise<void>
    {
        await this.buildMetadatas();
    }
}

test("SQL models distinguish lifecycle rows from retained command and economic records", async () => {
    for (const database of ["global", "kingdom_1"] as const)
    {
        const source = new MetadataDataSource(
            createPostgresDataSource(database).options,
        );
        await source.prepareMetadata();
        expect(source.isInitialized).toBe(false);
        expect(
            source.entityMetadatas.some(
                (metadata) => metadata.target === BaseEntity,
            ),
        ).toBe(false);
        for (const metadata of source.entityMetadatas)
        {
            if (
                [CommandReceipt, EconomyPosting, MutationOutbox].some(model =>
                    model === metadata.target
                )
            )
            {
                expect(metadata.deleteDateColumn).toBeUndefined();
                expect(metadata.updateDateColumn).toBeUndefined();
                expect(metadata.createDateColumn?.propertyName).toBe("createdAt");
                continue;
            }
            expect(
                [
                    Account,
                    CharacterProvisioning,
                    City,
                    CharacterResources,
                    Character,
                    Kingdom,
                    World,
                    WorldObject,
                    WorldResourceDeposit,
                    WorldObjectCell,
                    CityBuilding,
                    ConstructionJob,
                ].some((model) => model === metadata.target),
            ).toBe(true);
            if (typeof metadata.target !== "function")
            {
                throw new Error("Expected entity class");
            }
            expect(metadata.target.prototype).toBeInstanceOf(BaseEntity);
            for (
                const field of [
                    "id",
                    "publicId",
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                    "archivedAt",
                ]
            )
            {
                expect(
                    metadata.columns.filter(
                        (column) => column.propertyName === field,
                    ),
                ).toHaveLength(1);
            }
            expect(String(metadata.primaryColumns[0]?.generationStrategy)).toBe(
                "identity",
            );
            expect(metadata.createDateColumn?.propertyName).toBe("createdAt");
            expect(metadata.updateDateColumn?.propertyName).toBe("updatedAt");
            expect(metadata.deleteDateColumn?.propertyName).toBe("deletedAt");
            expect(
                metadata.findColumnWithPropertyName("archivedAt")?.isNullable,
            ).toBe(true);
        }
    }
});

test("soft deletion filters normal queries; archive timestamps require explicit filtering", async () => {
    const source = new MetadataDataSource(
        createPostgresDataSource("global").options,
    );
    await source.prepareMetadata();
    const query = source.getRepository(Kingdom).createQueryBuilder("kingdom");
    expect(query.getSql()).toContain("\"kingdom\".\"deleted_at\" IS NULL");
    expect(query.getSql()).not.toContain("\"kingdom\".\"archived_at\" IS NULL");
    expect(query.withDeleted().getSql()).not.toContain(
        "\"kingdom\".\"deleted_at\" IS NULL",
    );
    expect(source.isInitialized).toBe(false);
});
