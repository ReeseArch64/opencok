import { sfs, type Fields, type Value } from "@opencok/messages/sfs";
import type { ComebackActivity } from "@opencok/contracts/comeback";
import { rewardPreviewArray } from "./rewards";
export function comebackInfoView(activities: readonly ComebackActivity[]): Fields {
  if (
    activities.length > 3 ||
    new Set(activities.map((row) => row.type)).size !== activities.length
  )
    throw new Error("Invalid comeback activity projection");
  const body: Fields = { count: sfs.int(activities.length) };
  for (const row of activities) {
    if (row.type === 1)
      body.active1 = sfs.object({
        endTime: sfs.long(row.endTime),
        state: sfs.bool(row.claimed),
        ...(row.rewards ? { rewards: rewardPreviewArray(row.rewards) } : {}),
      });
    else if (row.type === 2)
      body.active2 = sfs.object({
        endTime: sfs.long(row.endTime),
        dailies: sfs.array(
          row.daily.map((entry) =>
            sfs.object({
              day: sfs.int(entry.day),
              state: sfs.int(entry.state),
              rewards: rewardPreviewArray(entry.rewards),
            }),
          ),
        ),
      });
    else
      body.active3 = sfs.object({
        endTime: sfs.long(row.endTime),
        currPay: sfs.long(row.currentPay),
        payNodes: sfs.array(
          row.payments.map((entry) =>
            sfs.object({
              pay: sfs.string(entry.pay),
              state: sfs.int(entry.state),
              rewards: rewardPreviewArray(entry.rewards),
            }),
          ),
        ),
      });
  }
  return body;
}
export function comebackRewardView(type: number, rewards: readonly Value[]): Fields {
  if (![1, 2, 3].includes(type) || rewards.length > 64)
    throw new Error("Invalid comeback reward projection");
  return { type: sfs.string(String(type)), rewards: sfs.array([...rewards]) };
}
