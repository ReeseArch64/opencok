import type { KingdomDatabase } from "../types/kingdom-database";

export function kingdomDatabase(kingdomId: number): KingdomDatabase
{
    if (
        !Number.isInteger(kingdomId)
        || kingdomId < 1
        || kingdomId > 2_147_483_647
    )
    {
        throw new RangeError("Identificador de reino inválido");
    }
    return `kingdom_${kingdomId}`;
}
