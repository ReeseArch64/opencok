import type { PaidGiftGateway } from "@opencok/contracts/paid-gifts";
import { num, text, long, type Row } from "@opencok/contracts/rows";
import type { Rules } from "@opencok/rules/game";
import { normalRechargeFailure } from "@opencok/rules/normal-recharge";
import { cityInteger } from "@opencok/rules/city-progression";

export async function deliveredPayment(
  gateway: PaidGiftGateway | undefined,
  owner: string,
  rules: Rules,
  orderId: string,
  platform: string,
  now: bigint,
  read: (orderId: string, platform: string) => Promise<Row | undefined>,
) {
  if (!gateway) {normalRechargeFailure();}

  const proof = await gateway.delivered({ owner, kingdomId: rules.kingdomId, orderId, platform }),
    catalog = rules.advanced.castleExchanges?.get(proof?.exchangeId ?? ""),
    payment = await read(orderId, platform);

  if (
    !proof ||
    proof.owner !== owner ||
    proof.kingdomId !== rules.kingdomId ||
    proof.orderId !== orderId ||
    proof.platform !== platform ||
    !catalog ||
    catalog.product_id !== proof.productId ||
    !/^[0-9]+(?:\.[0-9]{1,2})?$/.test(catalog.dollar ?? "") ||
    !Number.isSafeInteger(proof.priceCents) ||
    proof.priceCents <= 0 ||
    Math.round(Number(catalog.dollar) * 100) !== proof.priceCents ||
    typeof proof.occurredAt !== "bigint" ||
    proof.occurredAt <= 0n ||
    proof.occurredAt > now ||
    !Number.isSafeInteger(Number(proof.occurredAt)) ||
    !payment ||
    num(payment, "status") !== 2 ||
    text(payment, "productId") !== proof.productId ||
    payment.time === null ||
    long(payment, "time") !== proof.occurredAt ||
    Math.round(num(payment, "spend") * 100) !== proof.priceCents
  )
    {normalRechargeFailure();}

  const base = BigInt(cityInteger(catalog.gold_doller, 0));
  const gold = proof.rechargeGold ?? base;

  if (typeof gold !== "bigint" || gold < 0n || gold > base || gold > 2147483647n)
    {normalRechargeFailure();}

  return { proof, gold, payment };
}
