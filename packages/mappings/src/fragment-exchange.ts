import { validateFields } from "./validation";
import {
  fragmentExchangeOfferSchema,
  fragmentExchangeSchema,
} from "@opencok/validations/fragment-exchange";
import { sfs, type Fields, type Value } from "@opencok/messages/sfs";
import type { FragmentExchangeOffer } from "@opencok/contracts/fragment-exchange";

export function fragmentExchangeOfferView(
  offer: FragmentExchangeOffer,
  reward: Value,
  allReward?: readonly Value[],
): Fields {
  return validateFields(fragmentExchangeOfferSchema, {
    id: sfs.array(offer.id.map(sfs.string)),
    type: sfs.int(offer.type),
    same: sfs.int(offer.same),
    reward,
    multiple: sfs.int(offer.multiple),
    ...(allReward ? { allReward: sfs.array([...allReward]) } : {}),
  });
}

export function fragmentExchangeView(
  id: string,
  offers: readonly Fields[],
  pool: readonly string[],
  refresh: number,
  free: number,
  cost: number,
  includeIdentity = true,
): Fields {
  return validateFields(fragmentExchangeSchema, {
    info: sfs.array(offers.map(sfs.object)),
    exchangeId: sfs.string(pool.join(";")),
    refresh: sfs.int(refresh),
    freeNum: sfs.int(free),
    refreshCost: sfs.int(cost),
    ...(includeIdentity ? { actId: sfs.string(id) } : {}),
  });
}
