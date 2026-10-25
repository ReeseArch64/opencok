import { randomInt, randomUUID } from "node:crypto";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { encode, sfs, str, type Fields } from "@opencok/messages/sfs";
import { num, long, type Row } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import { localEventWindow } from "@opencok/rules/local-events";
import { previewRewards } from "@opencok/rules/rewards";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { minstrelInfo } from "@opencok/mappings/minstrel";
import { grantRewards } from "./quests";
import type { CityDomain, CityProgressionContext } from "./city-progression";

function shareMail(
  context: CityProgressionContext,
  templateId: string | undefined,
  rewardId: string | undefined,
) {
  const template = templateId ? context.rules.mail.get(templateId) : undefined;
  const contents = javaMailBytes(template?.message);
  if (!template || !contents || !rewardId || !context.rules.reconnect.rewards?.has(rewardId))
    throw new GameError(errors.unsupported, "city_progression");
  const rewards = previewRewards(
    rewardId,
    context.rules,
    { kingdomId: context.rules.kingdomId, version: "12.06.0", now: Number(context.now) },
    randomInt,
  );
  const reward = rewards
    .map((entry) => {
      if (entry.kind === "item" && entry.type === 7) return `goods,${entry.id},${entry.count}`;
      if (entry.kind === "count") {
        const asset = ["wood", "stone", "iron", "food", "silver", "gold"][entry.type];
        if (asset) return `${asset},0,${entry.value}`;
      }
      throw new GameError(errors.unsupported, "city_progression");
    })
    .join("|");
  if (!reward) throw new GameError(errors.invalid, "city_progression");
  const write = (context.write.quests ??= {});
  write.mail = [
    ...(write.mail ?? []),
    {
      uid: randomUUID().replaceAll("-", "") + "00",
      owner: context.owner,
      fromName: template.sender ?? "",
      title: template.title ?? "",
      type: 2,
      contents,
      extra: null,
      rewardId: reward,
      rewardStatus: 0,
      reply: 0,
      createTime: context.now,
    },
  ];
}
export const minstrelDomain: CityDomain = {
  commands: ["minstrel"],
  types: [],
  async prepare(context, _command, params) {
    if (!localEventWindow(context.rules.power.activityPanels?.get("57112"), context.now))
      throw new GameError(errors.unsupported, "city_progression");
    const rule = context.rules.items.get("minstrel");
    if (!rule) throw new GameError(errors.unsupported, "city_progression");
    const action = str(params, "M__REQUEST_ID__H");
    const row: Row = {
      uid: context.owner,
      type: 0,
      listen: 0,
      listentime: 0n,
      share: 0,
      sharetime: 0n,
      reward: 0,
      rewardtime: 0n,
      resettime: context.now,
      ...context.state.minstrel,
    };
    if (long(row, "resettime") / 86400000n !== context.now / 86400000n)
      Object.assign(row, { listen: 0, share: 0, reward: 0, resettime: context.now });
    const body: Fields = {};
    if (action === "listen") {
      if (num(row, "listen") >= cityInteger(rule.k5))
        throw new GameError(errors.invalid, "city_progression");
      if (num(row, "listen") === 0) body.rewards = grantRewards(context, rule.k6);
      row.listen = num(row, "listen") + 1;
      row.listentime = context.now;
    } else if (action === "share") {
      if (num(row, "share") >= cityInteger(rule.k7))
        throw new GameError(errors.invalid, "city_progression");
      if (num(row, "share") === 0) shareMail(context, rule.k8, rule.k9);
      row.share = num(row, "share") + 1;
      row.sharetime = context.now;
    } else if (action === "reward") {
      const interval = BigInt(cityInteger(num(row, "reward") === 0 ? rule.k2 : rule.k3)) * 1000n;
      if (
        num(row, "reward") >= cityInteger(rule.k1) ||
        context.now - long(row, "rewardtime") < interval
      )
        throw new GameError(errors.invalid, "city_progression");
      body.rewards = grantRewards(context, rule.k4);
      row.reward = num(row, "reward") + 1;
      row.rewardtime = context.now;
    } else if (action !== "info") throw new GameError(errors.invalid, "city_progression");
    context.write.minstrel = row;
    body.info = sfs.object(minstrelInfo(row, rule));
    return { response: encode(body), event: action === "info" ? null : undefined };
  },
  async apply() {
    throw new GameError(errors.unsupported, "city_progression");
  },
};
