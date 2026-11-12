import { z } from "zod";
import type { EntityManager } from "typeorm";
import { Character } from "../../models/kingdom/character";
import { characterCreateValidator } from "../../validators/character";
import { publicIdValidator } from "../../validators/repository";

export const provisionCharacterValidator = characterCreateValidator.pick({
    accountPublicId: true,
    displayName: true,
}).extend({ characterPublicId: publicIdValidator });
export type ProvisionCharacter = z.input<typeof provisionCharacterValidator>;

/** Realm-only operation. Replays never reset progression or recreate removed characters. */
export class ProvisionCharacterRepository
{
    constructor(private readonly manager: EntityManager)
    {}

    async execute(input: ProvisionCharacter): Promise<Character>
    {
        const { characterPublicId, ...value } = provisionCharacterValidator.parse(input);
        return this.manager.transaction(async tx => {
            const repository = tx.getRepository(Character);
            await repository.createQueryBuilder().insert().values({
                ...value,
                publicId: characterPublicId,
                level: 1,
                experience: "0",
            }).orIgnore().execute();
            const character = await repository.findOneOrFail({
                where: { accountPublicId: value.accountPublicId },
                withDeleted: true,
            });
            if (character.publicId !== characterPublicId)
            {
                throw new Error("Conta já possui outro personagem neste reino");
            }
            if (character.deletedAt || character.archivedAt)
            {
                throw new Error("Personagem indisponível");
            }
            return character;
        });
    }
}
