import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { DataSource, type EntityManager } from "typeorm";
import { Account, Character, CharacterProvisioning } from "../src/models";
import { createPostgresDataSource } from "../src/factories/postgres-data-source";
import { createAccountRepositories } from "../src/factories/account-repositories";
import { createCharacterProvisioningRepositories } from "../src/factories/character-provisioning-repositories";
import {
    ProvisionCharacterRepository,
    provisionCharacterValidator,
} from "../src/repositories/character/provision";
import { firebaseUidValidator } from "../src/validators/account";
import { CharacterProvisioningStatus } from "../src/enums/character-provisioning-status";

class MetadataSource extends DataSource
{
    async prepare()
    {
        await this.buildMetadatas();
    }
}

// Simulates an insert losing a uniqueness race and then reading the committed row.
function replayManager(record: object)
{
    let saves = 0;
    let ignored = 0;
    const builder = {
        insert()
        {
            return this;
        },
        values(_value: unknown)
        {
            return this;
        },
        orIgnore()
        {
            ignored++;
            return this;
        },
        async execute()
        {
            return {};
        },
    };
    const repository = {
        createQueryBuilder: () => builder,
        findOneOrFail: async () => record,
        save: async (value: unknown) => {
            saves++;
            return value;
        },
    };
    const manager = {
        connection: { options: { database: "global" } },
        getRepository: () => repository,
        transaction: async (fn: (tx: unknown) => unknown) => fn(manager),
    };
    return {
        manager: manager as unknown as EntityManager,
        saves: () => saves,
        ignored: () => ignored,
    };
}

test("Firebase identities remain opaque and repositories reject kingdom routing", () => {
    expect(firebaseUidValidator.parse(" AbC ")).toBe(" AbC ");
    expect(() => firebaseUidValidator.parse("")).toThrow();
    expect(() => firebaseUidValidator.parse("a".repeat(129))).toThrow();
    const manager = createPostgresDataSource("kingdom_1").manager;
    expect(() => createAccountRepositories(manager)).toThrow();
    expect(() => createCharacterProvisioningRepositories(manager)).toThrow();
    expect(() => provisionCharacterValidator.parse({
        accountPublicId: randomUUID(),
        characterPublicId: randomUUID(),
        displayName: "Aurora",
        level: 10,
    })).toThrow();
});

test("both databases enforce permanent uniqueness and global provisioning has foreign keys", async () => {
    for (const database of ["global", "kingdom_1"] as const)
    {
        const source = new MetadataSource(createPostgresDataSource(database).options);
        await source.prepare();
        if (database === "global")
        {
            const account = source.getMetadata(Account);
            expect(account.indices.find(index => index.name === "account_firebase_uid")?.isUnique)
                .toBe(true);
            expect(account.findColumnWithPropertyName("firebaseUid")?.isUpdate).toBe(false);
            const provisioning = source.getMetadata(CharacterProvisioning);
            expect(
                provisioning.indices.find(index => index.name === "provisioning_account_kingdom")
                    ?.isUnique,
            ).toBe(true);
            expect(provisioning.foreignKeys).toHaveLength(2);
        }
        else
        {
            expect(
                source.getMetadata(Character).indices.find(index =>
                    index.name === "character_account"
                )?.isUnique,
            ).toBe(true);
        }
    }
});

test("account retries return the same identity and cannot restore a deleted account", async () => {
    const record = Object.assign(new Account(), {
        firebaseUid: "firebase-id",
        publicId: randomUUID(),
        deletedAt: null,
        archivedAt: null,
    });
    const fixture = replayManager(record);
    const accounts = createAccountRepositories(fixture.manager);
    expect(await accounts.findOrCreate.execute({ firebaseUid: record.firebaseUid })).toBe(record);
    expect(fixture.ignored()).toBe(1);
    expect(fixture.saves()).toBe(0);
    Object.assign(record, { deletedAt: new Date() });
    await expect(accounts.findOrCreate.execute({ firebaseUid: record.firebaseUid })).rejects
        .toThrow("indisponível");
});

test("Realm retries preserve progression and reject mismatched or removed characters", async () => {
    const record = Object.assign(new Character(), {
        publicId: randomUUID(),
        accountPublicId: randomUUID(),
        displayName: "Aurora",
        level: 12,
        experience: "1000",
        deletedAt: null,
        archivedAt: null,
    });
    const fixture = replayManager(record);
    const provision = new ProvisionCharacterRepository(fixture.manager);
    const input = {
        characterPublicId: record.publicId,
        accountPublicId: record.accountPublicId,
        displayName: "Novo nome",
    };
    expect(await provision.execute(input)).toBe(record);
    expect(record.level).toBe(12);
    expect(record.experience).toBe("1000");
    expect(record.displayName).toBe("Aurora");
    expect(fixture.saves()).toBe(0);
    await expect(provision.execute({ ...input, characterPublicId: randomUUID() })).rejects.toThrow(
        "outro personagem",
    );
    Object.assign(record, { archivedAt: new Date() });
    await expect(provision.execute(input)).rejects.toThrow("indisponível");
});

test("completion is idempotent and verifies the reserved character", async () => {
    const record = {
        publicId: randomUUID(),
        characterPublicId: randomUUID(),
        status: CharacterProvisioningStatus.Pending,
        completedAt: null as Date | null,
        deletedAt: null,
        archivedAt: null,
    };
    const fixture = replayManager(record);
    const { complete } = createCharacterProvisioningRepositories(fixture.manager);
    const input = {
        provisioningPublicId: record.publicId,
        characterPublicId: record.characterPublicId,
    };
    await expect(complete.execute({ ...input, characterPublicId: randomUUID() })).rejects.toThrow(
        "diferente",
    );
    expect(fixture.saves()).toBe(0);
    await complete.execute(input);
    const completedAt = record.completedAt;
    expect(record.status).toBe(CharacterProvisioningStatus.Completed);
    expect(completedAt).toBeInstanceOf(Date);
    await complete.execute(input);
    expect(record.completedAt).toBe(completedAt);
    expect(fixture.saves()).toBe(1);
});
