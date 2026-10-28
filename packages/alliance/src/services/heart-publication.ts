import { decode, fields, str, int, Type } from "@opencok/messages/sfs";
import type { AllianceHeartInterests, AllianceHeartPublisher } from "../contracts/heart";
import type { AllianceHeartPublicationRuntime } from "../contracts/heart-runtime";
import type { AllianceHeartMapper } from "../mappings/heart";
import { AllianceHeartCommand } from "../enums/heart";

export class AllianceHeartPublicationService
{
    public constructor(
        private readonly interested: AllianceHeartInterests,
        private readonly publish: AllianceHeartPublisher,
        private readonly runtime: AllianceHeartPublicationRuntime,
        private readonly mapper: AllianceHeartMapper,
    )
    {}

    public async deliver(payload: Uint8Array)
    {
        const { interested, publish } = this;
        const { playerItemGiftRecipient } = this.runtime;
        const allianceHeartFailure: () => never = this.runtime.allianceHeartFailure;
        const event = decode(Buffer.from(payload)),
            owner = playerItemGiftRecipient(str(event, "owner")),
            recipient = str(event, "recipient", "");

        if (
            event.points?.type !== Type.Array
            || !Array.isArray(event.points.value)
            || event.points.value.length > 2
        )
        {
            allianceHeartFailure();
        }

        const points = event.points.value.map((value) => fields(value));
        const notification = recipient ? fields(event.notification) : undefined;

        for (const point of points)
        {
            const id = int(point, "id"),
                uid = playerItemGiftRecipient(str(point, "uid")),
                effect = str(point, "effect"),
                until = point.until;

            if (
                id <= 0
                || !effect
                || effect.length > 2
                || until?.type !== Type.Long
                || typeof until.value !== "bigint"
                || until.value <= 0n
            )
            {
                allianceHeartFailure();
            }

            const body = this.mapper.notification(id, effect, until.value);

            for (const observer of new Set(await interested([id], owner, "")))
            {
                if (observer && !(notification && observer === recipient && uid === recipient))
                {
                    await publish(observer, AllianceHeartCommand.Notification, body);
                }
            }
        }

        if (notification)
        {
            playerItemGiftRecipient(recipient);
            const point = Number(str(notification, "point")),
                until = BigInt(str(notification, "time"));

            if (
                !Number.isInteger(point) || point <= 0
                || str(notification, "receiveuid") !== recipient
            )
            {
                allianceHeartFailure();
            }

            await publish(
                recipient,
                AllianceHeartCommand.Notification,
                this.mapper.notification(
                    point,
                    str(notification, "effecttype"),
                    until,
                    recipient,
                    str(notification, "name"),
                ),
            );
        }
    }
}
