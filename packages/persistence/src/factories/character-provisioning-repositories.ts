import { randomUUID } from "node:crypto";
import type { EntityManager } from "typeorm";
import { Account } from "../models/global/account";
import { Kingdom } from "../models/global/kingdom";
import { CharacterProvisioning } from "../models/global/character-provisioning";
import { CharacterProvisioningStatus } from "../enums/character-provisioning-status";
import {
    reserveCharacterValidator,
    completeCharacterProvisioningValidator,
} from "../validators/character-provisioning";
import type {
    ReserveCharacter,
    CompleteCharacterProvisioning,
} from "../types/character-provisioning";

export function createCharacterProvisioningRepositories(manager: EntityManager)
{
    if (manager.connection.options.database !== "global")
    {
        throw new Error("Repository vinculado ao banco incorreto");
    }
    return {
        reserve: {
            async execute(input: ReserveCharacter): Promise<CharacterProvisioning>
            {
                const value = reserveCharacterValidator.parse(input);
                return manager.transaction(async tx => {
                    for (
                        const [target, id] of [
                            [Account, value.accountId],
                            [Kingdom, value.kingdomId],
                        ] as const
                    )
                    {
                        const record = await tx.getRepository(target).findOneOrFail({
                            where: { id },
                            withDeleted: true,
                            lock: { mode: "pessimistic_read" },
                        });
                        if (record.deletedAt || record.archivedAt)
                        {
                            throw new Error("Conta ou reino indisponível");
                        }
                    }
                    const repository = tx.getRepository(CharacterProvisioning);
                    await repository.createQueryBuilder().insert().values({
                        ...value,
                        characterPublicId: randomUUID(),
                        status: CharacterProvisioningStatus.Pending,
                        completedAt: null,
                    }).orIgnore().execute();
                    const record = await repository.findOneOrFail({
                        where: value,
                        withDeleted: true,
                    });
                    if (record.deletedAt || record.archivedAt)
                    {
                        throw new Error("Provisionamento indisponível");
                    }
                    return record;
                });
            },
        },
        // Call only after the authoritative Realm confirms its transaction committed.
        complete: {
            async execute(input: CompleteCharacterProvisioning): Promise<CharacterProvisioning>
            {
                const value = completeCharacterProvisioningValidator.parse(input);
                return manager.transaction(async tx => {
                    const repository = tx.getRepository(CharacterProvisioning);
                    const record = await repository.findOneOrFail({
                        where: { publicId: value.provisioningPublicId },
                        withDeleted: true,
                        lock: { mode: "pessimistic_write" },
                    });
                    if (record.deletedAt || record.archivedAt)
                    {
                        throw new Error("Provisionamento indisponível");
                    }
                    if (record.characterPublicId !== value.characterPublicId)
                    {
                        throw new Error("Personagem diferente do reservado");
                    }
                    if (record.status === CharacterProvisioningStatus.Completed)
                    {
                        return record;
                    }
                    record.status = CharacterProvisioningStatus.Completed;
                    record.completedAt = new Date();
                    return repository.save(record);
                });
            },
        },
    };
}
