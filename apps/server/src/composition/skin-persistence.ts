import { CosmeticRepository } from "@opencok/skins/repositories/cosmetics";
import type { CosmeticTransaction } from "@opencok/skins/contracts/persistence";
import { text, num, long } from "@opencok/contracts/rows";
import { playerItemGiftRecipient } from "@opencok/rules/player-item-gifts";
import { writePlayerEffects } from "@opencok/repositories/player-effects";

export function createRealmCosmeticRepository(tx: CosmeticTransaction, owner: string)
{
    return new CosmeticRepository(tx, owner, {
        text,
        num,
        long,
        playerItemGiftRecipient,
        writePlayerEffects,
    });
}
