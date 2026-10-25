import type { EconomyPosting } from "@opencok/contracts/mutation";

const maximum = 9223372036854775807n;
export function validatePosting(posting: EconomyPosting): bigint {
  for (const [value, limit] of [
    [posting.account, 40],
    [posting.asset, 64],
    [posting.reason, 128],
  ] as const)
    if (
      typeof value !== "string" ||
      !value.trim() ||
      value.length > limit ||
      !value.isWellFormed() ||
      value.includes("\0")
    )
      throw new Error("Invalid ledger identity");
  if (
    typeof posting.before !== "bigint" ||
    typeof posting.after !== "bigint" ||
    posting.before < 0n ||
    posting.after < 0n ||
    posting.before > maximum ||
    posting.after > maximum
  )
    throw new Error("Invalid ledger balance");
  return posting.after - posting.before;
}
