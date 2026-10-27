import { sfs } from "@opencok/messages/sfs";
import { rewardPreviewArray } from "./rewards";
import type { NormalRechargePeriod } from "@opencok/contracts/normal-recharge";
import type { RewardPreview } from "@opencok/contracts/rewards";
export function normalRechargeView(
  period: NormalRechargePeriod,
  points: bigint,
  face: string,
  rewards: readonly { point: number; rewards: readonly RewardPreview[]; important?: string }[],
) {
  if (rewards.length > 128) throw new Error("Recharge projection bound exceeded");
  return {
    repayinfo: sfs.object({
      faceInfo: sfs.string(face),
      startTime: sfs.long(period.start),
      endTime: sfs.long(period.end),
      payPoint: sfs.long(points),
      payRewards: sfs.array(
        rewards.map((row) =>
          sfs.object({
            point: sfs.int(row.point),
            reward: rewardPreviewArray(row.rewards),
            ...(row.important === undefined ? {} : { important: sfs.string(row.important) }),
          }),
        ),
      ),
      giftType: sfs.string(String(period.type)),
    }),
  };
}
