import { sfs } from "@opencok/messages/sfs";
import {
    allianceHeartSchema,
    allianceHeartLoginSchema,
    allianceHeartNotificationSchema,
} from "../validations/heart";
import { validateFields } from "@opencok/messages/validations/fields";

import type { AllianceHeartSendEvent } from "../contracts/heart";

export class AllianceHeartMapper
{
    public view(point: number)
    {
        return validateFields(allianceHeartSchema, { worldpoint: sfs.string(String(point)) });
    }

    public login(names: readonly string[] = [], effect = "-1", until = 0n)
    {
        return validateFields(allianceHeartLoginSchema, {
            heart_allsender: sfs.string(names.length ? names.join(",") : "-1"),
            heart_effecttype: sfs.string(effect),
            heart_time: sfs.long(until),
        });
    }

    public notification(
        point: number,
        effect: string,
        until: bigint,
        recipient = "-1",
        name?: string,
    )
    {
        return validateFields(allianceHeartNotificationSchema, {
            point: sfs.string(String(point)),
            effecttype: sfs.string(effect),
            time: sfs.string(String(until)),
            ...(name === undefined ? {} : { name: sfs.string(name) }),
            receiveuid: sfs.string(recipient),
        });
    }

    public loginEvent(
        owner: string,
        point: number,
        effect: string,
        until: bigint,
        names: readonly string[],
    )
    {
        return {
            owner: sfs.string(owner),
            points: sfs.array([]),
            recipient: sfs.string(owner),
            notification: sfs.object(
                this.notification(point, effect, until, owner, names.join(",")),
            ),
        };
    }

    public sendEvent(event: AllianceHeartSendEvent)
    {
        return {
            owner: sfs.string(event.owner),
            points: sfs.array(
                event.points.map((row) =>
                    sfs.object({
                        id: sfs.int(row.id),
                        uid: sfs.string(row.uid),
                        until: sfs.long(row.until),
                        effect: sfs.string(row.effect),
                    })
                ),
            ),
            ...(event.target && event.online
                ? {
                    recipient: sfs.string(event.recipient),
                    notification: sfs.object(
                        this.notification(
                            event.target,
                            event.effect,
                            event.until,
                            event.recipient,
                            event.name(),
                        ),
                    ),
                }
                : {}),
        };
    }
}
