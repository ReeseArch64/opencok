import { cityInteger } from "@opencok/rules/city-progression";
import { serverFeature } from "@opencok/rules/power-context";
import {
  militaryRankDefault,
  militaryRankEntitlement,
  militaryRankGrant,
  militaryRankHonorCap,
  militaryRankAsset,
  militaryRankValue,
} from "@opencok/rules/military-rank-awards";
import type {
  MilitaryRankAward,
  MilitaryRankAwardResponse,
} from "@opencok/contracts/military-rank-awards";
import type { CityProgressionContext } from "./city-progression-context.ts";

export async function applyMilitaryRankAward(
  context: CityProgressionContext,
  input: MilitaryRankAward & { entitlementId: string },
): Promise<MilitaryRankAwardResponse | undefined> {
  if (
    !serverFeature(context.rules, "wr_switch", {
      kingdomId: context.rules.kingdomId,
      version: "12.06.0",
      now: Number(context.now),
    })
  )
    {return undefined;}

  militaryRankEntitlement(input.entitlementId);
  const previous = context.write.militaryAward;

  if (previous && previous.entitlementId !== input.entitlementId)
    {throw new Error("Mixed military award entitlements");}

  const snapshot = previous
    ? { row: previous.before, clockMarker: previous.clockMarker }
    : await context.state.militaryAward?.load();

  if (
    !snapshot ||
    typeof snapshot.clockMarker !== "bigint" ||
    snapshot.clockMarker <= 0n ||
    snapshot.clockMarker > context.now
  )
    {throw new Error("Military award period unavailable");}

  const periodEnd =
    previous?.periodEnd ??
    snapshot.clockMarker +
      BigInt(cityInteger(context.rules.items.get("wr_info")?.k2, 1) + 1) * 86400000n;

  if (context.now >= periodEnd) {throw new Error("Military award period expired");}

  const before = previous?.after ?? snapshot.row ?? militaryRankDefault(context.owner),
    cap =
      previous?.honorCap ||
      (input.kind === "milhonor" ? militaryRankHonorCap(context.rules, before) : 0),
    asset = militaryRankAsset(input.kind),
    after = militaryRankGrant(before, input, cap);

  if (before.uid !== context.owner) {throw new Error("Foreign military award row");}

  context.write.militaryAward = {
    owner: context.owner,
    kingdomId: context.rules.kingdomId,
    entitlementId: input.entitlementId,
    clockMarker: snapshot.clockMarker,
    periodEnd,
    before: snapshot.row,
    after,
    honorCap: cap,
    awards: [...(previous?.awards ?? []), { kind: input.kind, amount: input.amount }],
  };

  if (context.write.militaryAward.awards.length > 64)
    {throw new Error("Military award bound exceeded");}

  return {
    requested: input.amount,
    credited: Number(
      (militaryRankValue(after[asset]) - militaryRankValue(before[asset])).toFixed(2),
    ),
    balance: militaryRankValue(after[asset]),
  };
}
