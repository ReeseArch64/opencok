import { sfs } from "@opencok/messages/sfs";
import {
    allianceHeartSchema,
    allianceHeartLoginSchema,
    allianceHeartNotificationSchema,
} from "@opencok/validations/alliance-heart";
import { validateFields } from "./validation";

export function allianceHeartView(point: number)
{
    return validateFields(allianceHeartSchema, { worldpoint: sfs.string(String(point)) });
}

export function allianceHeartLogin(names: readonly string[] = [], effect = "-1", until = 0n)
{
    return validateFields(allianceHeartLoginSchema, {
        heart_allsender: sfs.string(names.length ? names.join(",") : "-1"),
        heart_effecttype: sfs.string(effect),
        heart_time: sfs.long(until),
    });
}

export function allianceHeartNotification(
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
