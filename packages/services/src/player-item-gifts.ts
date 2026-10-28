import { CityCommandDomain } from "./city-command-domain.ts";
import { encode, decode, sfs, fields, str, Type, type Fields } from "@opencok/messages/sfs";
import { text, num } from "@opencok/contracts/rows";
import {
    playerItemGiftTarget,
    playerItemGiftRecipient,
    playerItemGiftFailure,
} from "@opencok/rules/player-item-gifts";
import { playerItemGiftView, playerItemGiftLogin } from "@opencok/mappings/player-item-gifts";
import { inventoryChanges } from "@opencok/economy/mappings/inventory";
import type { CityDomain } from "./city-domain.ts";

export class PlayerItemGiftDomain extends CityCommandDomain
{
    public readonly commands: CityDomain["commands"] = ["item.send", "gift.init"];

    public readonly types: CityDomain["types"] = [];

    public readonly prepare: CityDomain["prepare"] = async (context, command, params) => {
        const state = context.state.playerItemGifts;

        if (!state)
        {
            playerItemGiftFailure();
        }

        if (command === "item.send")
        {
            const recipient = playerItemGiftRecipient(str(params, "uid")),
                itemId = str(params, "itemId");
            playerItemGiftTarget(context.rules, itemId);

            if (
                state.recipient?.uid !== recipient
                || state.recipient.realm !== context.rules.kingdomId
            )
            {
                playerItemGiftFailure();
            }

            context.economy.item(itemId, -1);
            context.write.playerItemGifts = {
                send: { uid: recipient, itemId, createdAt: context.now },
            };

            return { response: encode(playerItemGiftView()), event: null };
        }

        if (!state.pending.length)
        {
            return { response: encode({}), event: null };
        }

        const ids: number[] = [],
            names: string[] = [],
            originals: string[] = [],
            items = new Set<string>();

        for (const gift of state.pending)
        {
            if (
                gift.uid !== context.owner || num(gift, "itemNum") < 0 || !Number.isInteger(gift.id)
            )
            {
                playerItemGiftFailure();
            }

            const itemId = text(gift, "itemId"),
                target = playerItemGiftTarget(context.rules, itemId);
            context.economy.item(target, 1);
            ids.push(num(gift, "id"));
            names.push(text(gift, "senderName"));
            originals.push(itemId);
            items.add(target);
        }

        context.write.playerItemGifts = { delivered: ids };
        const itemStates = [...items].map((id) => context.economy.itemState?.(id));

        if (itemStates.some((item) => !item))
        {
            playerItemGiftFailure();
        }

        const pushes = [
            {
                command: "push.useritem",
                body: inventoryChanges(
                    itemStates.map((item) => item!),
                    context.rules,
                ),
            },
            ...originals.map((itemId, index) => ({
                command: "push.item.having",
                body: { name: sfs.string(names[index]!), itemId: sfs.string(itemId) },
            })),
        ];

        return {
            response: encode(playerItemGiftLogin(names, originals)),
            event: params.notify?.type === Type.Bool && params.notify.value === true
                ? encode({
                    owner: sfs.string(context.owner),
                    pushes: sfs.array(
                        pushes.map((push) =>
                            sfs.object({
                                command: sfs.string(push.command),
                                body: sfs.object(push.body),
                            })
                        ),
                    ),
                })
                : null,
        };
    };

    public readonly apply: CityDomain["apply"] = async () => {
        playerItemGiftFailure();
    };
}

export const playerItemGiftDomain: CityDomain = new PlayerItemGiftDomain();

export async function publishPlayerItemGiftMutation(
    payload: Uint8Array,
    publish: (owner: string, command: string, body: Fields) => Promise<void>,
)
{
    const event = decode(Buffer.from(payload)),
        owner = playerItemGiftRecipient(str(event, "owner"));

    if (
        event.pushes?.type !== Type.Array
        || !Array.isArray(event.pushes.value)
        || event.pushes.value.length < 2
        || event.pushes.value.length > 65
    )
    {
        playerItemGiftFailure();
    }

    for (const value of event.pushes.value)
    {
        const push = fields(value),
            command = str(push, "command"),
            body = fields(push.body);

        if (command === "push.useritem")
        {
            if (
                body.useritemlist?.type !== Type.Array
                || !Array.isArray(body.useritemlist.value)
                || body.useritemlist.value.length > 64
            )
            {
                playerItemGiftFailure();
            }
        }
        else if (command === "push.item.having")
        {
            if (body.name?.type !== Type.String || body.itemId?.type !== Type.String)
            {
                playerItemGiftFailure();
            }
        }
        else
        {
            playerItemGiftFailure();
        }

        encode(body);
        await publish(owner, command, body);
    }
}
