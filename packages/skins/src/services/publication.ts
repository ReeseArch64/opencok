import { decode, fields, int, str, Type, sfs } from "@opencok/messages/sfs";
import type { CityCosmeticResponse } from "../contracts/responses/cosmetics";
import type { CosmeticPublicationRuntime } from "../contracts/runtime";
import { CosmeticMapper } from "../mappings/cosmetics";
import { CosmeticPush } from "../enums/command";
import { CosmeticKind, cosmeticKinds } from "../enums/kind";

export class CosmeticPublication
{
    public constructor(
        private readonly runtime: CosmeticPublicationRuntime,
        private readonly mapper: CosmeticMapper,
    )
    {}

    public readonly publishCosmeticInteractionMutation = async (payload: Uint8Array) => {
        const { playerItemGiftRecipient, interested, publish } = this.runtime;
        const { cityCosmeticUpdate } = this.mapper;
        const event = decode(Buffer.from(payload)),
            owner = playerItemGiftRecipient(str(event, "owner")),
            uid = playerItemGiftRecipient(str(event, "uid")),
            point = int(event, "point");

        if (
            event.statuses?.type !== Type.Array
            || !Array.isArray(event.statuses.value)
            || event.statuses.value.length > 64
            || event.kinds?.type !== Type.Array
            || !Array.isArray(event.kinds.value)
            || event.kinds.value.length > cosmeticKinds.length
            || point < 0
        )
        {
            throw new Error("Invalid cosmetic interaction event");
        }

        for (const status of event.statuses.value)
        {
            const update = fields(status),
                kind = int(update, "kind"),
                body = fields(update.body),
                id = int(body, "statusId");

            if (!cosmeticKinds.includes(kind))
            {
                throw new Error("Invalid cosmetic private status kind");
            }

            if (
                id <= 0 || body.endTime?.type !== Type.Long
                || body.effectState?.type !== Type.Object
            )
            {
                throw new Error("Invalid cosmetic status notification");
            }

            if (body.status)
            {
                if (
                    body.status.type !== Type.Array
                    || !Array.isArray(body.status.value)
                    || body.status.value.length > 128
                )
                {
                    throw new Error("Invalid cosmetic status effects");
                }

                for (const effect of body.status.value)
                {
                    const value = fields(effect);

                    if (
                        value.effNum?.type !== Type.Int
                        || value.effVal?.type !== Type.Int
                        || value.stateId?.type !== Type.Int
                        || int(value, "stateId") !== id
                    )
                    {
                        throw new Error("Invalid cosmetic status effect");
                    }
                }
            }

            await publish(uid, CosmeticPush.Status, body);

            if (kind === CosmeticKind.City)
            {
                await publish(uid, CosmeticPush.ServerAction, {
                    type: sfs.int(9),
                    params: sfs.object(body),
                });
            }
        }

        if (!point)
        {
            return;
        }

        const projection = fields(event.projection),
            recipients = new Set([owner, uid, ...(await interested([point], owner, uid))]);

        for (const kind of event.kinds.value)
        {
            const type = int({ kind }, "kind");
            if (!cosmeticKinds.includes(type))
            {
                throw new Error("Invalid cosmetic notification kind");
            }
            if (![CosmeticKind.City, CosmeticKind.Bubble, CosmeticKind.Overlap].includes(type))
            {
                for (const recipient of recipients)
                {
                    if (recipient)
                    {
                        await publish(recipient, CosmeticPush.WorldPoint, { id: sfs.int(point) });
                    }
                }
                continue;
            }
            let data: CityCosmeticResponse = {};

            if (type === CosmeticKind.City)
            {
                if (projection.sid)
                {
                    data = { sid: int(projection, "sid"), set: int(projection, "set") };
                }
            }
            else if (type === CosmeticKind.Bubble)
            {
                if (projection.bubble)
                {
                    const value = fields(projection.bubble);
                    data = { bubble: { sid: int(value, "sid"), set: int(value, "set") } };
                }
            }
            else if (type === CosmeticKind.Overlap)
            {
                if (projection.overlap)
                {
                    const value = fields(projection.overlap);
                    data = {
                        overlap: {
                            sid: int(value, "sid"),
                            set: int(value, "set"),
                            ...(value.count ? { count: int(value, "count") } : {}),
                        },
                    };
                }
            }
            else
            {
                throw new Error("Invalid cosmetic notification kind");
            }

            const body = cityCosmeticUpdate(data, uid, point),
                command = type === CosmeticKind.City
                    ? CosmeticPush.City
                    : type === CosmeticKind.Bubble
                    ? CosmeticPush.Bubble
                    : CosmeticPush.Overlap;

            for (const recipient of recipients)
            {
                if (recipient)
                {
                    await publish(recipient, command, body);
                }
            }
        }
    };
}
