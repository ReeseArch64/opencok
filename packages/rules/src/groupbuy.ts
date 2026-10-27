import { createHash } from "node:crypto";
import { cityAmount, cityInteger } from "./city-progression";
import { eventTimestamp } from "./local-events";
import type { Rules } from "./game";
import type { GroupBuyPeriod, GroupBuyRound, GroupBuyTier } from "@opencok/contracts/groupbuy";

export function groupBuyId(period: Pick<GroupBuyPeriod, "start" | "end">) {
  return createHash("sha1").update(`${period.start}:${period.end}`).digest("hex");
}

export function groupBuyPeriod(rules: Rules): GroupBuyPeriod | undefined {
  const panel = rules.power.activityPanels?.get("57133"),
    config = rules.items.get("alliance_groupbuys"),
    startAt = eventTimestamp(panel?.start),
    end = eventTimestamp(panel?.end);

  if (!config || startAt === undefined || end === undefined || end <= startAt) return;

  const start = (startAt / 86400000n) * 86400000n,
    count = cityInteger(config.k6, 1, 31),
    duration = cityInteger(config.k7, 1, 2592000) * 1000,
    wait = cityInteger(config.k8, 0, duration / 1000 - 1) * 1000;
  const rounds: GroupBuyRound[] = [];

  for (let i = 0; i < count; i++) {
    const sTime = Number(start) + i * duration,
      eTime = sTime + duration;

    if (BigInt(eTime) > end) break;

    if (!Number.isSafeInteger(eTime)) throw new Error("Invalid group-buy calendar");

    rounds.push({ sTime, eTime, cTime: eTime - wait, flag: 0, tiers: groupBuyTiers(rules, i + 1) });
  }

  return rounds.length ? { start, end, rounds } : undefined;
}

export function groupBuyTiers(rules: Rules, round: number): GroupBuyTier[] {
  const raw = rules.items.get("alliance_groupbuys_reward")?.[`k${cityInteger(round, 1, 31)}`];

  if (!raw) throw new Error("Missing group-buy rewards");

  const tiers = raw.split("|").map((value) => {
    const [level, reward, mail, ...extra] = value.split(";");

    if (
      extra.length ||
      !reward ||
      !mail ||
      !rules.reconnect.rewards?.has(reward) ||
      !rules.mail.has(mail)
    )
      throw new Error("Invalid group-buy reward");

    return { level: cityInteger(level, 1), reward, mail };
  });

  if (
    !tiers.length ||
    tiers.length > 128 ||
    new Set(tiers.map((t) => t.level)).size !== tiers.length
  )
    throw new Error("Invalid group-buy thresholds");

  return tiers;
}

export function groupBuyProducts(rules: Rules) {
  const raw = rules.items.get("alliance_groupbuys")?.k5;

  if (!raw) throw new Error("Missing group-buy products");

  const products = raw.split("|").map((value) => {
    const [id, point, ...extra] = value.split(";"),
      rule = rules.advanced.castleExchanges?.get(id!);

    if (extra.length || !id || !rule) throw new Error("Invalid group-buy product");

    return { id, point: cityInteger(point, 1, 10), rule };
  });

  if (products.length > 64 || new Set(products.map((p) => p.id)).size !== products.length)
    throw new Error("Invalid group-buy products");

  return products;
}

export function groupBuyRounds(raw: unknown) {
  if (typeof raw !== "string" || raw.length > 32768) throw new Error("Invalid group-buy schedule");

  const parsed: unknown = JSON.parse(raw);

  if (!Array.isArray(parsed) || !parsed.length || parsed.length > 31)
    throw new Error("Invalid group-buy rounds");

  return parsed.map((value): GroupBuyRound => {
    if (!value || typeof value !== "object") throw new Error("Invalid group-buy round");

    const row = value as Record<string, unknown>,
      sTime = Number(cityAmount(row.sTime)),
      eTime = Number(cityAmount(row.eTime)),
      cTime = Number(cityAmount(row.cTime)),
      flag = cityInteger(row.flag, 0, 1);

    if (![sTime, eTime, cTime].every(Number.isSafeInteger))
      throw new Error("Invalid group-buy clock");

    if (sTime >= eTime || cTime < sTime || cTime > eTime)
      throw new Error("Invalid group-buy boundaries");

    let tiers: GroupBuyTier[] | undefined;

    if (row.tiers !== undefined) {
      if (!Array.isArray(row.tiers) || !row.tiers.length || row.tiers.length > 128)
        throw new Error("Invalid group-buy stored tiers");

      tiers = row.tiers.map((value) => {
        if (!value || typeof value !== "object") throw new Error("Invalid group-buy stored tier");

        const tier = value as Record<string, unknown>;

        if (
          typeof tier.reward !== "string" ||
          typeof tier.mail !== "string" ||
          !/^\d{1,10}$/.test(tier.reward) ||
          !/^\d{1,10}$/.test(tier.mail)
        )
          throw new Error("Invalid group-buy stored reward");

        return { level: cityInteger(tier.level, 1), reward: tier.reward, mail: tier.mail };
      });

      if (new Set(tiers.map((tier) => tier.level)).size !== tiers.length)
        throw new Error("Duplicate group-buy stored tier");
    }

    const mail = row.mail === undefined ? undefined : String(row.mail);

    if (mail !== undefined && !/^\d{1,10}$/.test(mail)) throw new Error("Invalid group-buy mail");

    return {
      sTime,
      eTime,
      cTime,
      flag,
      ...(tiers ? { tiers } : {}),
      ...(row.total === undefined ? {} : { total: cityInteger(row.total) }),
      ...(mail === undefined ? {} : { mail }),
    };
  });
}
