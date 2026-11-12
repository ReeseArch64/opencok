import type { DataSource } from "typeorm";
import { Kingdom } from "../models/global/kingdom";
import { advanceIdentity } from "./advance-identity";

export async function seedKingdom(source: DataSource): Promise<void>
{
    await source.transaction(async (manager) => {
        await manager.query(
            "SELECT pg_advisory_xact_lock(hashtext('opencok.seed.kingdom'))",
        );
        await manager
            .createQueryBuilder()
            .insert()
            .into(Kingdom)
            .values({
                id: 1,
                publicId: "6a9d4b6c-53f5-43d7-91b8-9eb97ca15a54",
                displayName: "Reino de desenvolvimento",
            })
            .orIgnore()
            .execute();
        const kingdom = await manager
            .getRepository(Kingdom)
            .findOne({ where: { id: 1 }, withDeleted: true });
        if (!kingdom || kingdom.deletedAt || kingdom.archivedAt)
        {
            throw new Error(
                "O reino inicial está ausente, excluído ou arquivado",
            );
        }
        await advanceIdentity(manager, "kingdoms");
    });
}
