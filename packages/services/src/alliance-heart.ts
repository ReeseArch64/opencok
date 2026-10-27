import { encode, decode, sfs, fields, str, int, Type, type Fields } from "@opencok/messages/sfs";
import { text, num } from "@opencok/contracts/rows";
import { allianceHeartFailure, allianceHeartRule } from "@opencok/rules/alliance-heart";
import { playerItemGiftRecipient } from "@opencok/rules/player-item-gifts";
import {
  allianceHeartView,
  allianceHeartLogin,
  allianceHeartNotification,
} from "@opencok/mappings/alliance-heart";
import { GameError } from "@opencok/errors/game";
import type { CityDomain } from "./city-progression";

export function createAllianceHeartDomain(
  connected: (uid: string) => boolean = () => false,
): CityDomain {
  return {
    commands: ["heart.send", "heart.init"],
    types: [],
    async prepare(context, command, params) {
      const state = context.state.allianceHeart;

      if (!state) allianceHeartFailure();

      if (command === "heart.init") {
        if (!state.pending.length) return { response: encode(allianceHeartLogin()), event: null };

        const first = state.pending[0]!,
          duration = num(first, "duration"),
          effect = text(first, "effecttype");

        if (
          !Number.isInteger(duration) ||
          duration <= 0 ||
          !effect ||
          effect.length > 2 ||
          state.pending.some((row) => row.uid !== context.owner)
        )
          allianceHeartFailure();

        const until = context.now + BigInt(duration) * 1000n,
          names = state.pending.map((row) => text(row, "senderName"));
        context.write.allianceHeart = { delivered: state.pending.map((row) => num(row, "id")) };
        const world = state.worlds.find(
            (row) => row.uid === context.owner && num(row, "worldId") === 0,
          ),
          point = world ? num(world, "pointId") : 0;

        return {
          response: encode(allianceHeartLogin(names, effect, until)),
          event:
            params.notify?.type === Type.Bool && params.notify.value === true && point > 0
              ? encode({
                  owner: sfs.string(context.owner),
                  points: sfs.array([]),
                  recipient: sfs.string(context.owner),
                  notification: sfs.object(
                    allianceHeartNotification(point, effect, until, context.owner, names.join(",")),
                  ),
                })
              : null,
        };
      }

      const recipient = playerItemGiftRecipient(str(params, "uid")),
        alliance = state.members.find((row) => row.uid === context.owner)?.allianceId;

      if (!alliance || state.members.find((row) => row.uid === recipient)?.allianceId !== alliance)
        throw new GameError("152027");

      if (
        state.recipient?.uid !== recipient ||
        num(state.recipient, "serverId") !== context.rules.kingdomId
      )
        allianceHeartFailure();

      const itemId = str(params, "itemId"),
        uuid = str(params, "uuid"),
        item = context.economy.ownedItem?.(uuid),
        rule = allianceHeartRule(context.rules, itemId);

      if (!item || item.itemId !== itemId || item.count < 1 || !context.economy.consumeItem)
        allianceHeartFailure();

      const city = (uid: string) => {
          const world = state.worlds.find((row) => row.uid === uid);

          if (!world || num(world, "pointId") === 0) return;

          if (num(world, "worldId") !== 0) allianceHeartFailure();

          const point = state.points.find(
            (row) => row.id === world.pointId && row.ownerId === uid && num(row, "pointType") === 1,
          );

          if (!point) allianceHeartFailure();

          return num(point, "id");
        },
        own = city(context.owner),
        target = city(recipient);

      if (!own) allianceHeartFailure();

      const until = context.now + BigInt(rule.duration) * 1000n,
        points = [{ id: own, uid: context.owner, until, effect: rule.effect }];

      if (target && target !== own)
        points.push({ id: target, uid: recipient, until, effect: rule.effect });

      context.economy.consumeItem(uuid, 1);
      const online = connected(recipient);
      context.write.allianceHeart = {
        points,
        ...(target && !online ? { pending: { uid: recipient, ...rule } } : {}),
      };

      return {
        response: encode(allianceHeartView(target ?? own)),
        event: encode({
          owner: sfs.string(context.owner),
          points: sfs.array(
            points.map((row) =>
              sfs.object({
                id: sfs.int(row.id),
                uid: sfs.string(row.uid),
                until: sfs.long(row.until),
                effect: sfs.string(row.effect),
              }),
            ),
          ),
          ...(target && online
            ? {
                recipient: sfs.string(recipient),
                notification: sfs.object(
                  allianceHeartNotification(
                    target,
                    rule.effect,
                    until,
                    recipient,
                    text(context.state.profile, "name"),
                  ),
                ),
              }
            : {}),
        }),
      };
    },
    async apply() {
      allianceHeartFailure();
    },
  };
}

export async function publishAllianceHeartMutation(
  payload: Uint8Array,
  interested: (
    points: readonly number[],
    owner: string,
    target: string,
  ) => Promise<readonly string[]>,
  publish: (owner: string, command: string, body: Fields) => Promise<unknown>,
) {
  const event = decode(Buffer.from(payload)),
    owner = playerItemGiftRecipient(str(event, "owner")),
    recipient = str(event, "recipient", "");

  if (
    event.points?.type !== Type.Array ||
    !Array.isArray(event.points.value) ||
    event.points.value.length > 2
  )
    allianceHeartFailure();

  const points = event.points.value.map((value) => fields(value));
  const notification = recipient ? fields(event.notification) : undefined;

  for (const point of points) {
    const id = int(point, "id"),
      uid = playerItemGiftRecipient(str(point, "uid")),
      effect = str(point, "effect"),
      until = point.until;

    if (
      id <= 0 ||
      !effect ||
      effect.length > 2 ||
      until?.type !== Type.Long ||
      typeof until.value !== "bigint" ||
      until.value <= 0n
    )
      allianceHeartFailure();

    const body = allianceHeartNotification(id, effect, until.value);

    for (const observer of new Set(await interested([id], owner, ""))) {
      if (observer && !(notification && observer === recipient && uid === recipient))
        await publish(observer, "push.heart.having", body);
    }
  }

  if (notification) {
    playerItemGiftRecipient(recipient);
    const point = Number(str(notification, "point")),
      until = BigInt(str(notification, "time"));

    if (!Number.isInteger(point) || point <= 0 || str(notification, "receiveuid") !== recipient)
      allianceHeartFailure();

    await publish(
      recipient,
      "push.heart.having",
      allianceHeartNotification(
        point,
        str(notification, "effecttype"),
        until,
        recipient,
        str(notification, "name"),
      ),
    );
  }
}
