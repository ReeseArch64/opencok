import { randomInt } from "node:crypto";
import { sfs, encode, decode, fields, int, str, Type, type Fields } from "@opencok/messages/sfs";
import { num, long } from "@opencok/contracts/rows";
import { troubleItem, troubleRemovalGold } from "@opencok/rules/trouble";
import { troubleHistory } from "@opencok/mappings/trouble";
import { temporaryEffect } from "@opencok/rules/player-effects";
import { cityCosmeticProjection } from "@opencok/rules/city-cosmetics";
import { cityCosmeticFields } from "@opencok/mappings/city-cosmetics";
import { worldMutationFailure } from "@opencok/rules/world-march-runtime";
import { playerItemGiftRecipient } from "@opencok/rules/player-item-gifts";
import type { CityDomain, CityProgressionContext } from "./city-progression";
function event(context: CityProgressionContext, body: Fields, sender = context.owner) {
  return encode({
    owner: sfs.string(sender),
    uid: sfs.string(context.owner),
    point: sfs.int(context.state.trouble!.point),
    body: sfs.object(body),
  });
}
export const troubleDomain: CityDomain = {
  commands: ["get.trouble.list", "trouble.speed", "trouble.deliver"],
  types: [],
  async prepare(context, command, params) {
    if (!context.state.trouble) worldMutationFailure();
    if (command === "get.trouble.list")
      return { response: encode(troubleHistory(context.state.trouble.history)), event: null };
    if (command === "trouble.speed") {
      const state = context.state.effects.states.find((row) =>
        ["3", "4"].includes(context.rules.power.statuses?.get(String(row.stateId))?.overlap ?? ""),
      );
      if (!state) worldMutationFailure();
      context.economy.gold(-troubleRemovalGold(context.rules, long(state, "endTime"), context.now));
      const id = num(state, "stateId");
      context.write.deletedStates = [id];
      const projection = cityCosmeticFields(
        cityCosmeticProjection(
          context.state.effects.states.filter((row) => row.stateId !== id),
          context.rules,
          context.now,
        ),
      );
      return {
        response: encode({ remainGold: sfs.long(context.balance("gold")), statusid: sfs.int(id) }),
        event: event(context, {
          sid: sfs.int(0),
          set: sfs.int(0),
          ...projection,
          uid: sfs.string(context.owner),
          worldpointid: sfs.int(context.state.trouble.point),
        }),
      };
    }
    const item = str(params, "item"),
      sender = playerItemGiftRecipient(str(params, "sender")),
      username = str(params, "username"),
      at = params.at?.type === Type.Long ? BigInt(params.at.value as bigint) : -1n;
    if (username.length > 255 || at < 0n || at > context.now) worldMutationFailure();
    const rule = troubleItem(context.rules, item),
      result = temporaryEffect(
        context.state.effects.states,
        context.rules,
        context.owner,
        rule.id,
        at,
        1,
        randomInt,
      ),
      state = result.states[0];
    if (!state) worldMutationFailure();
    context.write.states = result.states;
    context.write.deletedStates = result.deleted;
    context.write.troubleHistory = { username, at, status: rule.id, item };
    const old = result.deleted[0],
      id = num(state, "stateId"),
      end = long(state, "endTime"),
      body: Fields = {
        effectState: sfs.object({
          [String(id)]: sfs.long(end),
          startTime: sfs.long(long(state, "startTime")),
        }),
        statusId: sfs.int(id),
        endTime: sfs.long(end),
        ...(old === undefined ? {} : { oldStatus: sfs.string(String(old)) }),
        username: sfs.string(username),
        useItemId: sfs.string(item),
        targetUserId: sfs.string(context.owner),
        cityIndex: sfs.int(context.state.trouble.point),
      };
    return { response: encode({}), event: event(context, body, sender) };
  },
  async apply() {
    worldMutationFailure();
  },
};
export async function deliverWorldTroubles(
  payload: Buffer,
  deliver: (owner: string, params: Fields) => Promise<unknown>,
) {
  const data = decode(payload),
    rows = data.troubles;
  if (!rows) return;
  if (rows.type !== Type.Array || !Array.isArray(rows.value) || rows.value.length > 256)
    throw new Error("Invalid trouble arrivals");
  for (const value of rows.value) {
    const row = fields(value),
      target = playerItemGiftRecipient(str(row, "target")),
      id = str(row, "march");
    if (!/^[a-f0-9-]{36}$/.test(id)) throw new Error("Invalid trouble march identity");
    await deliver(target, { ...row, operationId: sfs.string(`trouble:${id}`) });
  }
}
export async function publishTroubleMutation(
  payload: Buffer,
  command: string,
  interested: (
    points: readonly number[],
    owner: string,
    target: string,
  ) => Promise<readonly string[]>,
  publish: (owner: string, command: string, body: Fields) => Promise<unknown>,
) {
  const data = decode(payload),
    owner = playerItemGiftRecipient(str(data, "owner")),
    uid = playerItemGiftRecipient(str(data, "uid")),
    point = int(data, "point"),
    body = fields(data.body);
  if (point < 0 || !["trouble.deliver", "trouble.speed"].includes(command))
    throw new Error("Invalid trouble notification");
  const recipients = new Set([uid, ...(point ? await interested([point], owner, uid) : [])]);
  for (const recipient of recipients)
    if (recipient)
      await publish(
        recipient,
        command === "trouble.deliver" ? "push.trouble.avatar" : "push.city.status",
        body,
      );
}
