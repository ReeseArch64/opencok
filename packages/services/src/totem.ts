import { randomInt, randomUUID } from "node:crypto";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { sfs, encode, str, int, type Fields } from "@opencok/messages/sfs";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import type { AvatarSystemMail } from "@opencok/contracts/files";
import type { TotemEffectStore } from "@opencok/contracts/totem";
import {
  totemFailure,
  totemFootprint,
  totemNeighbours,
  totemEndTime,
  pinTotemConfiguration,
  restoreTotemConfiguration,
} from "@opencok/rules/totem";
import { temporaryEffect } from "@opencok/rules/player-effects";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { serverFeature } from "@opencok/rules/power-context";
import { cityInteger } from "@opencok/rules/city-progression";
import type { Rules, Rule } from "@opencok/rules/game";
import type { CityDomain, CityProgressionContext } from "./city-progression";

function totemMail(
  template: { sender?: string; title?: string; message?: string },
  owner: string,
  now: bigint,
  params: readonly (string | number)[],
): AvatarSystemMail {
  const contents = javaMailBytes(`${template.message}|${params.join("|")}`);
  if (!template.message || !contents) totemFailure();
  return {
    uid: randomUUID().replaceAll("-", "") + "00",
    owner,
    fromName: template.sender ?? "",
    title: template.title ?? "",
    type: 2,
    contents,
    extra: null,
    rewardId: null,
    rewardStatus: 1,
    reply: 0,
    createTime: now,
  };
}
function mail(
  context: CityProgressionContext,
  rule: Rule,
  field: string,
  params: readonly (string | number)[],
) {
  const template = context.rules.mail.get(rule[field] ?? "");
  if (!template) totemFailure();
  const write = (context.write.quests ??= {});
  write.mail = [...(write.mail ?? []), totemMail(template, context.owner, context.now, params)];
}
export async function expireTotems(store: TotemEffectStore, size: number) {
  for (;;) {
    const due = await store.due();
    for (const { activation, cities } of due) {
      const config = restoreTotemConfiguration(activation.payload as Buffer);
      const deliveries = cities.flatMap((city) => {
        const friendly = text(activation, "allianceId")
          ? text(activation, "allianceId") === text(city, "allianceId")
          : text(activation, "ownerUid") === text(city, "uid");
        const stateId = friendly ? config.friendlyStateId : config.enemyStateId;
        return stateId ? [{ owner: text(city, "uid"), stateId }] : [];
      });
      await store.expire(
        activation,
        deliveries,
        totemFootprint(num(activation, "pointId"), config.width, size),
      );
    }
    if (due.length < 64) break;
  }
}
export async function settleTotemEffects(store: TotemEffectStore, rules: Rules, size: number) {
  await expireTotems(store, size);
  for (;;) {
    const pending = await store.pending();
    for (const delivery of pending) {
      const at = long(delivery.activation, "dueAt");
      const config = restoreTotemConfiguration(delivery.activation.payload as Buffer);
      let plan;
      try {
        plan = temporaryEffect(
          await store.states(),
          rules,
          delivery.activation.targetUid as string,
          String(delivery.stateId),
          at,
          1,
          randomInt,
        );
      } catch (error) {
        if (!(error instanceof GameError) || error.code !== errors.locked) throw error;
        plan = { states: [], deleted: [] };
      }
      const state = plan.states[0];
      const push: Fields = state
        ? {
            effectState: sfs.object({
              [String(state.stateId)]: sfs.long(long(state, "endTime")),
              startTime: sfs.long(long(state, "startTime")),
            }),
            statusId: sfs.int(num(state, "stateId")),
            endTime: sfs.long(long(state, "endTime")),
            status: sfs.array(
              (rules.power.statuses?.get(String(state.stateId))?.effect ?? "")
                .split("|")
                .filter(Boolean)
                .map((pair) => {
                  const [id, value] = pair.split(";").map(Number);
                  return sfs.object({
                    effNum: sfs.int(id!),
                    effVal: sfs.int(value!),
                    stateId: sfs.int(num(state, "stateId")),
                  });
                }),
            ),
            ...(plan.deleted.length ? { oldStatus: sfs.string(plan.deleted.join(",")) } : {}),
          }
        : {};
      const message = totemMail(config.takeEffectMail, text(delivery.activation, "targetUid"), at, [
        rules.kingdomId,
        num(delivery.activation, "pointId"),
        delivery.stateId,
      ]);
      await store.apply(delivery, plan.states, plan.deleted, message, encode(push));
    }
    if (pending.length < 64) break;
  }
}
export function createTotemDomain(size: number): CityDomain {
  return {
    commands: ["totem", "totem.tick", "totem.init"],
    types: [],
    async prepare(context, command, params) {
      if (command === "totem.tick") return { response: encode({}), event: null };
      if (command === "totem.init")
        return {
          response: encode({
            totems: sfs.array(
              (context.state.totems?.history ?? []).map((row) =>
                sfs.object({
                  totemId: sfs.int(num(row, "totemId")),
                  putTime: sfs.long(long(row, "putTime")),
                }),
              ),
            ),
          }),
          event: null,
        };
      if (
        !serverFeature(context.rules, "totem_on", {
          kingdomId: context.rules.kingdomId,
          version: "12.06.0",
          now: Number(context.now),
        })
      )
        totemFailure();
      const state = context.state.totems,
        world = context.state.worldMutation;
      if (!state || !world) totemFailure();
      const action = str(params, "M__REQUEST_ID__H");
      if (action === "info")
        return {
          response: encode({
            totems: sfs.array(
              state.history.map((row) =>
                sfs.object({
                  totemId: sfs.int(num(row, "totemId")),
                  putTime: sfs.long(long(row, "putTime")),
                }),
              ),
            ),
          }),
          event: null,
        };
      const pointId = int(params, "pointId"),
        points: Row[] = [],
        activations: Row[] = [];
      let totemId = 0,
        status = 0;
      const body: Fields = {};
      if (action === "put") {
        const item = context.economy.ownedItem?.(str(params, "itemUUid"));
        const goods = item ? context.rules.goods.get(item.itemId) : undefined;
        if (!item || item.count < 1 || goods?.type !== "47") totemFailure();
        const rule = context.rules.advanced.totems?.get(goods.para1 ?? "");
        if (!rule) totemFailure();
        totemId = cityInteger(rule.id, 1);
        const history = state.history.find((row) => num(row, "totemId") === totemId);
        if (
          history &&
          long(history, "putTime") + BigInt(cityInteger(rule.cd_time)) * 60000n > context.now
        )
          totemFailure();
        if (
          state.active.filter((row) => row.ownerUid === context.owner).length >=
          cityInteger(context.rules.items.get("totem")?.k1 ?? 1, 1)
        )
          totemFailure();
        const footprint = totemFootprint(pointId, cityInteger(rule.cover_area, 1), size);
        for (const id of footprint) {
          const point = world.points.find((row) => num(row, "id") === id);
          if (
            !point ||
            num(point, "pointType") !== 0 ||
            num(point, "gridType") !== 2 ||
            num(point, "grid2Type") !== 0 ||
            num(point, "resInitValue") > 0
          )
            totemFailure();
          points.push({
            ...point,
            pointType: id === pointId ? 64 : 65,
            ownerId: context.owner,
            ownerName: text(context.state.profile, "name"),
            allianceId: text(context.state.profile, "allianceId"),
            pointItem: String(totemId),
            monsterCurrHP: cityInteger(rule.architecture),
            startTime: context.now,
          });
        }
        const alliance = text(context.state.profile, "allianceId");
        const nearby = state.active.filter(
          (row) =>
            num(row, "totemId") === totemId &&
            (alliance ? text(row, "allianceId") === alliance : row.ownerUid === context.owner) &&
            totemNeighbours(
              pointId,
              num(row, "pointId"),
              cityInteger(rule.range_of_action, 1),
              size,
            ),
        );
        const dueAt = totemEndTime(
          nearby.map((row) => ({ point: num(row, "pointId"), dueAt: long(row, "dueAt") })),
          rule,
          context.now,
          size,
        );
        for (const point of points) point.fireTime = dueAt;
        for (const row of nearby)
          if (long(row, "dueAt") > dueAt) {
            activations.push({ ...row, dueAt, expectedDueAt: long(row, "dueAt") });
            const point = world.points.find((p) => num(p, "id") === num(row, "pointId"));
            if (!point) totemFailure();
            points.push({ ...point, fireTime: dueAt });
          }
        activations.push({
          id: randomUUID().replaceAll("-", ""),
          ownerUid: context.owner,
          pointId,
          totemId,
          allianceId: alliance,
          startedAt: context.now,
          dueAt,
          status: 0,
          payload: pinTotemConfiguration(context.rules, rule),
        });
        if (goods.permanent_props !== "1") context.economy.item(item.itemId, -1);
        context.write.totems = { history: [{ uid: context.owner, totemId, putTime: context.now }] };
        mail(context, rule, "place_mail", [
          context.rules.kingdomId,
          pointId,
          totemId,
          Number((dueAt - context.now) / 1000n),
        ]);
        body.totemId = sfs.int(totemId);
        body.putTime = sfs.long(context.now);
        status = 1;
      } else if (action === "remove") {
        const activation = state.active.find(
          (row) => num(row, "pointId") === pointId && row.ownerUid === context.owner,
        );
        if (!activation) totemFailure();
        totemId = num(activation, "totemId");
        const config = restoreTotemConfiguration(activation.payload as Buffer);
        for (const id of totemFootprint(pointId, config.width, size)) {
          const point = world.points.find((row) => num(row, "id") === id);
          if (
            !point ||
            text(point, "ownerId") !== context.owner ||
            ![64, 65].includes(num(point, "pointType"))
          )
            totemFailure();
          points.push({
            ...point,
            pointType: 0,
            pointItem: "",
            ownerId: "",
            ownerName: "",
            allianceId: "",
            monsterCurrHP: 0,
            fireTime: 0n,
          });
        }
        activations.push({ ...activation, status: 2, expectedDueAt: long(activation, "dueAt") });
        const rule = context.rules.advanced.totems?.get(String(totemId));
        if (!rule) totemFailure();
        mail(context, rule, "recycle_mail", [context.rules.kingdomId, pointId]);
        status = 2;
      } else totemFailure();
      context.write.totems = { ...context.write.totems, activations };
      context.write.worldMutation = { points };
      return {
        response: encode(body),
        event: encode({
          owner: sfs.string(context.owner),
          origin: sfs.int(pointId),
          points: sfs.array(points.map((row) => sfs.object({ id: sfs.int(num(row, "id")) }))),
          totems: sfs.array([
            sfs.object({
              pointId: sfs.int(pointId),
              totemId: sfs.int(totemId),
              status: sfs.int(status),
            }),
          ]),
        }),
      };
    },
    async apply() {
      totemFailure();
    },
  };
}
