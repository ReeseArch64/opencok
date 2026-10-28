import { CityCommandDomain } from "./city-command-domain.ts";
import { specialEventInfo } from "@opencok/mappings/special-event";
import { createHash } from "node:crypto";
import { encode, str } from "@opencok/messages/sfs";
import { num, long, text } from "@opencok/contracts/rows";
import { specialEventWindow, specialEventProducts } from "@opencok/rules/special-event";
import { cityInteger } from "@opencok/rules/city-progression";
import type {
    SpecialEventStock,
    SpecialEventPaymentGateway,
    SpecialEventBuyer,
} from "@opencok/contracts/special-event";
import type { Rules } from "@opencok/rules/game";
import type { CityDomain } from "./city-domain.ts";

export class SpecialEventPurchaseService
{
    constructor(
        readonly stock: SpecialEventStock,
        readonly rules: Rules,
        readonly gateway?: SpecialEventPaymentGateway,
        readonly now = Date.now,
        readonly buyer?: SpecialEventBuyer,
    )
    {}

    async reserve(owner: string, kingdom: number, eventId: string, exchangeId: string)
    {
        const at = this.now(),
            period = specialEventWindow(this.rules, {
                kingdomId: kingdom,
                version: "12.06.0",
                now: at,
            }),
            product = specialEventProducts(this.rules).find((row) => row.id === exchangeId);

        if (!period || !product || !this.buyer)
        {
            throw new Error("Special event purchase unavailable");
        }

        const previous = await this.buyer.purchaseTime({ owner, kingdomId: kingdom, exchangeId });

        if (previous !== null && previous / 86400000n === BigInt(at) / 86400000n)
        {
            throw new Error("Special event daily limit reached");
        }

        return this.stock.reserve(
            {
                ...period,
                eventId,
                ownerUid: owner,
                kingdomId: kingdom,
                exchangeId,
                reservedAt: BigInt(at),
            },
            cityInteger(product.buy_limit, 1),
        );
    }

    async confirm(eventId: string)
    {
        const reservation = await this.stock.find(eventId);

        if (!reservation || !this.gateway || num(reservation, "state") === 2)
        {
            throw new Error("Special event payment unavailable");
        }

        const proof = await this.gateway.accepted({
            eventId,
            owner: text(reservation, "ownerUid"),
            kingdomId: num(reservation, "kingdomId"),
            exchangeId: text(reservation, "exchangeId"),
        });

        if (!proof || proof.at > BigInt(this.now()))
        {
            throw new Error("Unverified special event purchase");
        }

        return this.stock.confirm(eventId, proof.at);
    }
}

export function specialEventOperation(eventId: string)
{
    return `special:${createHash("sha256").update(eventId).digest("hex")}`;
}

export class SpecialEventDomain extends CityCommandDomain
{
    public readonly commands: CityDomain["commands"];
    public readonly types: CityDomain["types"];
    public readonly prepare: CityDomain["prepare"];
    public readonly apply: CityDomain["apply"];

    public constructor(stock: Pick<SpecialEventStock, "counts" | "find">)
    {
        super();

        this.commands = ["special.ui.state", "special.paid"];

        this.types = [];

        this.prepare = async (context, command, params) => {
            if (command === "special.ui.state")
            {
                const period = specialEventWindow(context.rules, {
                    kingdomId: context.rules.kingdomId,
                    version: "12.06.0",
                    now: Number(context.now),
                });

                if (!period)
                {
                    return { response: encode({}), event: null };
                }

                const products = specialEventProducts(context.rules, true),
                    counts = await stock.counts(
                        period,
                        products.map((row) => row.id!),
                    ),
                    values = products.map((row) => counts.get(row.id!) ?? 0);

                return {
                    response: encode(specialEventInfo(values)),
                    event: null,
                };
            }

            const eventId = str(params, "eventId"),
                proof = await stock.find(eventId);

            if (
                !proof
                || num(proof, "state") !== 1
                || proof.ownerUid !== context.owner
                || num(proof, "kingdomId") !== context.rules.kingdomId
                || long(proof, "purchaseTime") > context.now
            )
            {
                throw new Error("Unverified special event delivery");
            }

            context.write.specialEventPurchase = {
                uid: context.owner,
                id: text(proof, "exchangeId"),
                beginTime: long(proof, "periodStart"),
                buyTime: long(proof, "purchaseTime"),
            };

            return { response: encode({}), event: null };
        };

        this.apply = async () => {
            throw new Error("Special event has no timed queue");
        };
    }
}

export function createSpecialEventDomain(
    stock: Pick<SpecialEventStock, "counts" | "find">,
): CityDomain
{
    return new SpecialEventDomain(stock);
}
