import { createHash } from "node:crypto";
import { targetFailure } from "../validations/target-failure";

export class TargetTaskPaymentIdentity
{
    public readonly targetTaskPurchaseOperationId = (owner: string, eventId: string): string => {
        if (!/^[A-Za-z0-9:._-]{1,128}$/.test(eventId))
        {
            targetFailure();
        }

        return `targetpaid:${createHash("sha256").update(`${owner}\0${eventId}`).digest("hex")}`;
    };
}
