import { z } from "zod";
import { createZodDto, wire } from "./dto.ts";

import type { RewardPreview } from "@opencok/contracts/rewards";
import { sfs, type Value } from "@opencok/messages/sfs";

function serializeRewardPreviewArray(rewards: readonly RewardPreview[]): Value {
  return sfs.array(
    rewards.map((reward) => {
      const value =
        reward.kind === "count"
          ? sfs.int(reward.value)
          : reward.kind === "item"
            ? sfs.object({ id: sfs.string(reward.id), num: sfs.int(reward.count) })
            : sfs.object({
                isCurrentCivilization: sfs.bool(reward.currentCivilization),
                value: sfs.int(reward.value),
              });
      return sfs.object({ type: sfs.int(reward.type), value });
    }),
  );
}

export class RewardPreviewArrayDto extends createZodDto(
  wire.array(
    wire.object(
      z.strictObject({
        type: wire.int,
        value: z.union([
          wire.int,
          wire.object(z.strictObject({ id: wire.string, num: wire.int })),
          wire.object(z.strictObject({ isCurrentCivilization: wire.bool, value: wire.int })),
        ]),
      }),
    ),
  ),
) {}

export function rewardPreviewArray(...args: Parameters<typeof serializeRewardPreviewArray>): Value {
  return new RewardPreviewArrayDto(serializeRewardPreviewArray(...args));
}
