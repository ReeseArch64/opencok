import type { GameServices } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import type { RuleContext } from "@opencok/rules/availability";
import type { Rules } from "@opencok/rules/game";
import {
  resourceExpeditionConfigured,
  resourceMergeServer,
} from "@opencok/rules/world-resource-effects";
import { ownerInteger } from "./world-resource-owner-values.ts";

export async function readResourceExpeditionLoadEffect(
  profile: Row,
  rules: Rules,
  context: RuleContext,
  services: Pick<GameServices, "expeditionStage">,
  resolve: (effect: 895) => number,
): Promise<number> {
  try {
    if (
      !resourceExpeditionConfigured(rules, context, () =>
        resourceMergeServer(rules, context.kingdomId),
      )
    )
      return 0;
    const stage = await services.expeditionStage?.(context.kingdomId);
    if (stage !== 3) return 0;
    const origin = ownerInteger(profile.crossFightSrcServerId);
    const home = origin === -1 ? ownerInteger(profile.serverId) : origin;
    if (home !== context.kingdomId) return 0;
    const value = resolve(895);
    return typeof value === "number" ? Math.fround(value) : 0;
  } catch {
    return 0;
  }
}
