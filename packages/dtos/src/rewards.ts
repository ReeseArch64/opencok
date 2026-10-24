import type { RewardPreview } from "@opencok/contracts/rewards";
import { sfs, type Value } from "@opencok/messages/sfs";

export function rewardPreviewArray(rewards: readonly RewardPreview[]): Value {
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
