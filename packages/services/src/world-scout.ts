import { scoutWatchtowerValues } from "@opencok/rules/world-scout-watchtower";
import type { GameServices } from "@opencok/contracts/game";
import type { WorldScoutStore } from "@opencok/contracts/world-scout";
import { num, long, text } from "@opencok/contracts/rows";
import { int, sfs, type Fields } from "@opencok/messages/sfs";
import type { Rules } from "@opencok/rules/game";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { barbarianCurrentHP, scoutCost } from "@opencok/rules/world-scout";
import { ordinaryMarchRoute, worldFootprint } from "@opencok/rules/world-march-runtime";
import { resolveWorldCityGeometry } from "@opencok/rules/world-city-geometry";
import { worldPowerEffects } from "@opencok/rules/power-world";
import { playerGameEffect } from "@opencok/rules/power-resolver";
import { generalSkillPoints, decodeWorldPowerEffects } from "./power";
import { resourceOwnerRuleContext } from "./world-resource-owner-context";

function invalid(): never {
  throw new GameError(errors.unsupported, "world_point_detail");
}

export async function worldScoutQuotation(
  store: WorldScoutStore,
  observer: string,
  params: Fields,
  rules: Rules,
  kingdomId: number,
  size: number,
  now: number,
  services: Pick<GameServices, "worldPowerEffects" | "emperorVersion">,
): Promise<Fields> {
  const id = int(params, "point");

  if (id < 1 || id > size * size || !Number.isSafeInteger(now) || now < 0) invalid();

  const snapshot = await store.read(observer, id, kingdomId, now);

  if (
    !snapshot ||
    snapshot.profile.uid !== observer ||
    snapshot.world.uid !== observer ||
    num(snapshot.world, "worldId") !== 0 ||
    num(snapshot.profile, "serverId") !== kingdomId ||
    num(snapshot.profile, "banFlag") !== 0 ||
    long(snapshot.profile, "banTime") > BigInt(now)
  )
    invalid();

  const point = snapshot.point,
    kind = num(point, "pointType"),
    barbarian =
      kind === 44 &&
      text(point, "pointItem") &&
      long(point, "flushTime") > BigInt(now) &&
      barbarianCurrentHP(point, snapshot.barbarian, rules, BigInt(now)) > 0;

  if (point.ownerId == null && ![14, 23, 46, 47].includes(kind) && !barbarian) invalid();

  const context = resourceOwnerRuleContext(snapshot.owner, { kingdomId, now });

  if (!services.worldPowerEffects) invalid();

  const world = worldPowerEffects(
      decodeWorldPowerEffects(await services.worldPowerEffects(kingdomId)),
      rules,
      context,
    ),
    emperor = snapshot.owner.effects.throneRewards.length
      ? await services.emperorVersion?.(kingdomId)
      : undefined,
    abilities = generalSkillPoints(snapshot.owner.effects.generals),
    effect = (id: Parameters<typeof playerGameEffect>[6]) =>
      playerGameEffect(snapshot.owner.effects, rules, context, abilities, world, emperor, id);
  const detect = scoutWatchtowerValues(
    rules,
    snapshot.buildings.find((row) => num(row, "itemId") === 417000),
    context,
  ).speed;
  const source = num(snapshot.world, "pointId"),
    origin = resolveWorldCityGeometry(source, size, observer, snapshot.points)?.points;

  if (!origin) invalid();

  let destination: readonly number[] | undefined;

  if (kind === 1 || kind === 68) {
    destination = resolveWorldCityGeometry(
      id,
      size,
      text(point, "ownerId"),
      snapshot.points,
      kind,
      kind === 68 ? [69] : [8, 2],
    )?.points;

    if (!destination) invalid();
  } else if ([6, 12, 18, 21, 15, 49, 66].includes(kind)) destination = worldFootprint(id, size);

  if (size > 600 && id === 1 + 600 + 600 * size)
    destination = Array.from(
      { length: 9 },
      (_, index) => id + ((index % 3) - 1) + (Math.floor(index / 3) - 1) * size,
    );

  const route = ordinaryMarchRoute(
    rules,
    size,
    source,
    id,
    1,
    Math.fround(Math.fround(effect(401) + detect) + effect(402)),
    true,
    false,
    0,
    true,
    origin,
    destination,
  );

  return {
    pic: sfs.string(text(snapshot.profile, "pic")),
    point: sfs.int(id),
    scoutTime: sfs.int(Number(route.duration)),
    scoutCost: sfs.int(scoutCost(point, snapshot.targetCastle, rules, effect(404))),
  };
}
