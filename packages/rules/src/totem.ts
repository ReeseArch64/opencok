import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { PinnedTotemConfiguration } from "@opencok/contracts/totem";
import type { Rules, Rule } from "./game";
import { cityInteger } from "./city-progression";

export function totemFailure(): never {
  throw new GameError(errors.locked, "city_progression");
}

export function totemFootprint(point: number, width: number, size: number): number[] {
  if (
    !Number.isInteger(point) ||
    point <= 0 ||
    point > size * size ||
    !Number.isInteger(width) ||
    width < 1 ||
    width > 4
  )
    {totemFailure();}

  const x = (point - 1) % size,
    y = Math.floor((point - 1) / size);

  if (x + width > size || y + width > size) {totemFailure();}

  return Array.from(
    { length: width * width },
    (_, i) => point + (i % width) + Math.floor(i / width) * size,
  );
}

export function totemNeighbours(a: number, b: number, range: number, size: number) {
  const dx = Math.abs(((a - 1) % size) - ((b - 1) % size)),
    dy = Math.abs(Math.floor((a - 1) / size) - Math.floor((b - 1) / size));

  return dx <= range && dy <= range && dx + dy < 2 * range;
}

export function totemEndTime(
  points: readonly { point: number; dueAt: bigint }[],
  rule: Rule,
  now: bigint,
  size: number,
) {
  let minimum = now + BigInt(cityInteger(rule.take_effect_time, 1)) * 60000n;

  if (!points.length) {return minimum;}

  const floor = now + BigInt(cityInteger(rule.minimum_time)) * 60000n;

  for (const point of points) {if (point.dueAt < minimum) {minimum = point.dueAt;}}

  if (minimum < floor) {return minimum;}

  const range = cityInteger(rule.range_of_action, 1);
  let remaining = [...points],
    smallest = points.length;

  while (remaining.length) {
    const first = remaining.shift()!;
    const matches = remaining.filter((p) => totemNeighbours(first.point, p.point, range, size));

    if (first.dueAt === minimum) {smallest = Math.min(smallest, matches.length + 1);}

    remaining = remaining.filter((p) => !matches.includes(p));
  }

  const reduced =
    minimum - BigInt(cityInteger(rule.reduce_time)) * 60000n * BigInt(points.length - smallest + 1);

  return reduced > floor ? reduced : floor;
}

export function pinTotemConfiguration(rules: Rules, rule: Rule): Buffer {
  const mail = rules.mail.get(rule.take_effect_mail ?? "");

  if (!mail?.message) {totemFailure();}

  const configuration: PinnedTotemConfiguration = {
    width: cityInteger(rule.cover_area, 1),
    range: cityInteger(rule.range_of_action, 1),
    friendlyStateId: cityInteger(rule.friendly_state_id ?? 0),
    enemyStateId: cityInteger(rule.enemy_state_id ?? 0),
    takeEffectMail: { sender: mail.sender ?? "", title: mail.title ?? "", message: mail.message },
  };

  for (const state of [configuration.friendlyStateId, configuration.enemyStateId])
    {if (state && !rules.power.statuses?.has(String(state))) {totemFailure();}}

  return Buffer.from(JSON.stringify(configuration));
}

export function restoreTotemConfiguration(payload: Buffer): PinnedTotemConfiguration {
  if (payload.length > 4096) {totemFailure();}

  const data = JSON.parse(payload.toString("utf8")) as PinnedTotemConfiguration;

  if (
    !data ||
    !Number.isInteger(data.width) ||
    data.width < 1 ||
    data.width > 4 ||
    !Number.isInteger(data.range) ||
    data.range < 1 ||
    data.range > 1200 ||
    !Number.isInteger(data.friendlyStateId) ||
    data.friendlyStateId < 0 ||
    !Number.isInteger(data.enemyStateId) ||
    data.enemyStateId < 0 ||
    !data.takeEffectMail ||
    [data.takeEffectMail.sender, data.takeEffectMail.title, data.takeEffectMail.message].some(
      (v) => typeof v !== "string" || !v.isWellFormed() || v.includes("\0"),
    )
  )
    {totemFailure();}

  return data;
}
