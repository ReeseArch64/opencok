import type { CampaignAudience } from "@opencok/contracts/campaign-notice";
import type { Fields } from "@opencok/messages/sfs";
export async function publishMergeEffectBoard(
  online: readonly string[],
  audience: CampaignAudience,
  current: () => Promise<Fields>,
  publish: (owner: string, command: string, body: Fields) => Promise<unknown>,
  now = Date.now,
) {
  const owners = [...new Set(online)];
  for (let offset = 0; offset < owners.length; offset += 500) {
    const recipients = await audience.select(
      owners.slice(offset, offset + 500),
      undefined,
      BigInt(now()),
    );
    for (let index = 0; index < recipients.length; index += 32) {
      const body = await current();
      await Promise.all(
        recipients
          .slice(index, index + 32)
          .map((owner) => publish(owner, "world.effect.push", body)),
      );
    }
  }
}
