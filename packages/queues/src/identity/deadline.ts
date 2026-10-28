import { createHmac, timingSafeEqual } from "node:crypto";
import { activityDeadlinePath } from "../contracts/deadline";

export function signActivityDeadline(
    body: string,
    timestamp: string,
    secret: string,
    response = false,
): string
{
    return createHmac("sha256", secret).update(
        `opencok-activity-deadlines-v1\n${
            response ? "RESPONSE" : "POST"
        }\n${activityDeadlinePath}\n${timestamp}\n${body}`,
    ).digest("hex");
}

export function verifyActivityDeadline(
    body: string,
    timestamp: string | null,
    signature: string | null,
    secret: string,
    now = Date.now(),
    response = false,
): boolean
{
    if (
        secret.length < 32 || !timestamp || !/^[0-9]{1,16}$/.test(timestamp)
        || !Number.isSafeInteger(Number(timestamp)) || !Number.isSafeInteger(now)
        || Math.abs(now - Number(timestamp)) > 30000 || !signature
        || !/^[a-f0-9]{64}$/.test(signature)
    )
    {
        return false;
    }

    return timingSafeEqual(
        Buffer.from(signature, "hex"),
        Buffer.from(signActivityDeadline(body, timestamp, secret, response), "hex"),
    );
}
