import type { CityCosmeticResponse } from "@opencok/contracts/responses/city-cosmetics";
import { serverFeature } from "@opencok/rules/power-context";
import { cityInteger } from "@opencok/rules/city-progression";
import { encode, decode, sfs, fields, int, str, Type, type Fields } from "@opencok/messages/sfs";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import { cityCosmeticProjection } from "@opencok/rules/city-cosmetics";
import { cityCosmeticFields, cityCosmeticUpdate } from "@opencok/mappings/city-cosmetics";
import { playerItemGiftRecipient } from "@opencok/rules/player-item-gifts";
import type { CityProgressionContext } from "./city-progression";
export function cosmeticOwnership(
  context: CityProgressionContext,
  uid: string,
  id: string,
  previous: readonly Row[],
  states: readonly Row[],
) {
  const target = context.state.cosmeticTarget,
    rule = context.rules.power.statuses?.get(id);
  if (
    target?.uid !== uid ||
    !rule?.subgroup ||
    !["100", "105", "200"].includes(rule.type2 ?? "") ||
    !serverFeature(context.rules, "avatar", {
      kingdomId: context.rules.kingdomId,
      version: "12.06.0",
      now: Number(context.now),
    })
  )
    return;
  const dirty = context.write.cosmeticTarget?.avatars ?? [];
  const avatars = [
    ...target.avatars.filter((row) => !dirty.some((next) => next.avatarId === row.avatarId)),
    ...dirty,
  ];
  let owned = avatars.find((row) => {
    const old = context.rules.power.statuses?.get(text(row, "avatarId"));
    return (
      (long(row, "expirationTime") === -1n || long(row, "expirationTime") > context.now) &&
      old?.type2 === rule.type2 &&
      old?.subgroup === rule.subgroup
    );
  });
  const counter =
    rule.overlap === "5" &&
    previous.some((row) => String(row.stateId) === id && long(row, "endTime") > context.now);
  if (!counter) {
    const duration = BigInt(cityInteger(rule.time ?? 0)) * 1000n;
    const expiration =
      rule.time === undefined || (owned && long(owned, "expirationTime") === -1n)
        ? -1n
        : owned && rule.type2 !== "100"
          ? long(owned, "expirationTime")
          : (owned ? long(owned, "expirationTime") : context.now) + duration;
    owned = { uid, avatarId: owned?.avatarId ?? id, expirationTime: expiration, effectiveSign: 0 };
  }
  if (owned)
    for (const state of states)
      state.endTime =
        long(owned, "expirationTime") === -1n
          ? 9223372036854775807n
          : long(owned, "expirationTime");
  return counter ? undefined : [...dirty.filter((row) => row.avatarId !== owned!.avatarId), owned!];
}
export function cosmeticTargetStates(context: CityProgressionContext) {
  const target = context.state.cosmeticTarget;
  if (!target) throw new Error("Missing cosmetic target");
  const write = context.write.cosmeticTarget;
  if (!write) return target.states;
  return [
    ...target.states.filter(
      (row) =>
        !write.deleted.includes(num(row, "stateId")) &&
        !write.states.some((next) => next.stateId === row.stateId),
    ),
    ...write.states,
  ];
}
export function cosmeticInteractionParticipants(owner: string, command: string, params: Fields) {
  if (
    command !== "trigger.activity" ||
    int(params, "type", -1) !== 45 ||
    !str(params, "uid", "").trim()
  )
    return;
  return [...new Set([owner, playerItemGiftRecipient(str(params, "uid"))])];
}
export function cosmeticInteractionEvent(
  context: CityProgressionContext,
  statusResponse?: Fields,
): Uint8Array | null {
  const changed = context.write.cosmeticChanges;
  if (!changed?.length) return null;
  const target = context.state.cosmeticTarget;
  if (
    !target ||
    target.realm !== context.rules.kingdomId ||
    changed.length > 64 ||
    changed.some((row) => row.uid !== target.uid)
  )
    throw new Error("Invalid cosmetic interaction changes");
  const states =
    target.uid === context.owner
      ? (context.write.states ?? context.state.effects.states)
      : cosmeticTargetStates(context);
  const kinds = new Set<number>();
  const updates = changed.map((change) => {
    const row = states.find((row) => row.stateId === change.id);
    if (!row) throw new Error("Missing changed cosmetic status");
    const type = num(row, "type2");
    if (![100, 105, 200].includes(type)) throw new Error("Unsupported cosmetic status kind");
    kinds.add(type);
    const body: Fields = {
      effectState: sfs.object({
        [String(change.id)]: sfs.long(
          long(row, "endTime") === 9223372036854775807n ? 2147000000000n : long(row, "endTime"),
        ),
        startTime: sfs.long(long(row, "startTime")),
      }),
      statusId: sfs.int(change.id),
      endTime: sfs.long(long(row, "endTime")),
      status: sfs.array([]),
      ...(change.previous === undefined ? {} : { oldStatus: sfs.string(String(change.previous)) }),
    };
    return sfs.object({ kind: sfs.int(type), body: sfs.object(statusResponse ?? body) });
  });
  return encode({
    owner: sfs.string(context.owner),
    uid: sfs.string(target.uid),
    point: sfs.int(target.point),
    statuses: sfs.array(updates),
    kinds: sfs.array([...kinds].map(sfs.int)),
    projection: sfs.object(
      cityCosmeticFields(cityCosmeticProjection(states, context.rules, context.now)),
    ),
  });
}
export async function publishCosmeticInteractionMutation(
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
    uid = playerItemGiftRecipient(str(event, "uid")),
    point = int(event, "point");
  if (
    event.statuses?.type !== Type.Array ||
    !Array.isArray(event.statuses.value) ||
    event.statuses.value.length > 64 ||
    event.kinds?.type !== Type.Array ||
    !Array.isArray(event.kinds.value) ||
    event.kinds.value.length > 3 ||
    point < 0
  )
    throw new Error("Invalid cosmetic interaction event");
  for (const status of event.statuses.value) {
    const update = fields(status),
      kind = int(update, "kind"),
      body = fields(update.body),
      id = int(body, "statusId");
    if (![100, 105, 200].includes(kind)) throw new Error("Invalid cosmetic private status kind");
    if (id <= 0 || body.endTime?.type !== Type.Long || body.effectState?.type !== Type.Object)
      throw new Error("Invalid cosmetic status notification");
    if (body.status) {
      if (
        body.status.type !== Type.Array ||
        !Array.isArray(body.status.value) ||
        body.status.value.length > 128
      )
        throw new Error("Invalid cosmetic status effects");
      for (const effect of body.status.value) {
        const value = fields(effect);
        if (
          value.effNum?.type !== Type.Int ||
          value.effVal?.type !== Type.Int ||
          value.stateId?.type !== Type.Int ||
          int(value, "stateId") !== id
        )
          throw new Error("Invalid cosmetic status effect");
      }
    }
    await publish(uid, "status.push", body);
    if (kind === 100)
      await publish(uid, "push.server.action", { type: sfs.int(9), params: sfs.object(body) });
  }
  if (!point) return;
  const projection = fields(event.projection),
    recipients = new Set([owner, uid, ...(await interested([point], owner, uid))]);
  for (const kind of event.kinds.value) {
    const type = int({ kind }, "kind");
    let data: CityCosmeticResponse = {};
    if (type === 100) {
      if (projection.sid) data = { sid: int(projection, "sid"), set: int(projection, "set") };
    } else if (type === 105) {
      if (projection.bubble) {
        const value = fields(projection.bubble);
        data = { bubble: { sid: int(value, "sid"), set: int(value, "set") } };
      }
    } else if (type === 200) {
      if (projection.overlap) {
        const value = fields(projection.overlap);
        data = {
          overlap: {
            sid: int(value, "sid"),
            set: int(value, "set"),
            ...(value.count ? { count: int(value, "count") } : {}),
          },
        };
      }
    } else throw new Error("Invalid cosmetic notification kind");
    const body = cityCosmeticUpdate(data, uid, point),
      command =
        type === 100
          ? "push.city.status"
          : type === 105
            ? "push.bubble.status"
            : "push.overlap.status";
    for (const recipient of recipients) if (recipient) await publish(recipient, command, body);
  }
}
