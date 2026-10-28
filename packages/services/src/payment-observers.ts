import { AsyncLocalStorage } from "node:async_hooks";
import type { PaidGiftGateway } from "@opencok/contracts/paid-gifts";
import type { Row } from "@opencok/contracts/rows";
import type { Rules } from "@opencok/rules/game";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { deliveredPayment } from "./delivered-payment";
import { normalRechargeOperation, normalRechargeParameters } from "./normal-recharge";
import { paidGiftParameters } from "./red-packets";
import { rechargeActivityOperationId } from "./recharge-activity";
import { rechargeFeedbackOperationId } from "./recharge-feedback";

export function createPaymentObservers(
    gateway: PaidGiftGateway | undefined,
    rules: Rules,
    read: (owner: string, orderId: string, platform: string) => Promise<Row | undefined>,
    command: (owner: string, command: string, params: Fields) => Promise<unknown>,
    now = Date.now,
)
{
    const deliveries = new AsyncLocalStorage<{
        owner: string;
        orderId: string;
        platform: string;
        eventId: string;
    }>();
    const accepted = async (owner: string, eventId: string) => {
        const delivery = deliveries.getStore();

        if (!delivery || delivery.owner !== owner || delivery.eventId !== eventId)
        {
            return null;
        }

        return deliveredPayment(
            gateway,
            owner,
            rules,
            delivery.orderId,
            delivery.platform,
            BigInt(now()),
            (order, platform) => read(owner, order, platform),
        );
    };

    return {
        newcomer: {
            async accepted({ owner, eventId }: { owner: string; eventId: string; })
            {
                const evidence = await accepted(owner, eventId);

                return evidence
                    ? { rechargeGold: evidence.gold, occurredAt: evidence.proof.occurredAt }
                    : null;
            },
        },
        feedback: {
            async accepted({ owner, eventId }: { owner: string; eventId: string; })
            {
                const evidence = await accepted(owner, eventId);

                return evidence
                    ? {
                        orderId: evidence.proof.orderId,
                        platform: evidence.proof.platform,
                        productId: evidence.proof.productId,
                    }
                    : null;
            },
        },
        async consume(owner: string, orderId: string, platform: string)
        {
            const eventId = normalRechargeOperation(owner, orderId, platform).slice(9);
            await deliveries.run({ owner, orderId, platform, eventId }, async () => {
                await command(
                    owner,
                    "normal.recharge.paid",
                    normalRechargeParameters(owner, orderId, platform),
                );
                await command(
                    owner,
                    "campaign.paid.gift",
                    paidGiftParameters(owner, orderId, platform),
                );
                await command(owner, "new.sercum.paid", {
                    eventId: sfs.string(eventId),
                    operationId: sfs.string(rechargeActivityOperationId(owner, eventId)),
                });
                await command(owner, "feedback.paid", {
                    eventId: sfs.string(eventId),
                    operationId: sfs.string(rechargeFeedbackOperationId(owner, eventId)),
                });
            });
        },
    };
}
