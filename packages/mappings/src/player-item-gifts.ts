import { sfs, Type, type Fields } from "@opencok/messages/sfs";
import {
    playerItemGiftSchema,
    playerItemGiftLoginSchema,
} from "@opencok/validations/player-item-gifts";
import { validateFields } from "./validation";

export function playerItemGiftView(): Fields
{
    return validateFields(playerItemGiftSchema, { result: sfs.bool(true) });
}

export function playerItemGiftLogin(names: readonly string[], items: readonly string[]): Fields
{
    if (names.length !== items.length)
    {
        throw new Error("Mismatched received gift names and items");
    }

    return validateFields(playerItemGiftLoginSchema, {
        item_allname: { type: Type.StringArray, value: [...names] },
        item_allitemId: { type: Type.StringArray, value: [...items] },
    });
}
