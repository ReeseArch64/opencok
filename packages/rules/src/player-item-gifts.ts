import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { Rules } from "./game";

export function playerItemGiftFailure(): never
{
    throw new GameError(errors.invalid, "city_progression");
}

export function playerItemGiftTarget(rules: Rules, itemId: string): string
{
    const rule = rules.goods.get(itemId),
        target = rule?.para1;

    if (rule?.type !== "25" || !target || !rules.goods.has(target))
    {
        playerItemGiftFailure();
    }

    return target;
}

export function playerItemGiftRecipient(uid: string): string
{
    if (!uid.trim() || uid.length > 40 || !uid.isWellFormed() || uid.includes("\0"))
    {
        playerItemGiftFailure();
    }

    return uid;
}
