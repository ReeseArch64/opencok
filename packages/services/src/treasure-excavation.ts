import { randomUUID } from "node:crypto";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import type { RuntimeMarch } from "@opencok/contracts/world-march-runtime";
import type { AvatarSystemMail } from "@opencok/contracts/files";
import { encode, sfs } from "@opencok/messages/sfs";
import { decodeWorldMarchArmy } from "@opencok/messages/world-resource-army";
import { reconnectMarchGeneral } from "@opencok/mappings/reconnect-marches";
import { treasureMapOccupation } from "@opencok/mappings/treasure-map";
import { cityInteger } from "@opencok/rules/city-progression";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { worldMutationFailure } from "@opencok/rules/world-march-runtime";
import { dragonDefinition, dragonFeature } from "@opencok/rules/dragon-progression";
import { treasureMapItem, treasureMapFree } from "@opencok/rules/treasure-map";
import { pinProgressionReward } from "./progression-rewards";
import { treasureMapRoster, writeTreasureMap, deleteTreasureMap } from "./treasure-map-state";
import type { CityProgressionContext } from "./city-progression";

function appendMail(context: CityProgressionContext, message: AvatarSystemMail) {
  const write = (context.write.quests ??= {});
  write.mail = [...(write.mail ?? []), message];
}
function encampMail(context: CityProgressionContext, state: RuntimeMarch, original: Row) {
  const army = original.armyInfo ? decodeWorldMarchArmy(original.armyInfo as Buffer) : null;
  if (!army || army.owner !== context.owner) worldMutationFailure();
  const general = army.general
    ? reconnectMarchGeneral(army.general, context.state.generalRoster?.skills ?? [], context.now)
    : undefined;
  const dragons = dragonFeature(context.rules, "dragon_battle", context.now)
    ? (army.dragons ?? []).map((saved) => {
        const dragon = context.state.dragons?.dragons.find(
          (row) => row.uuid === saved.uuid && row.uid === context.owner,
        );
        if (!dragon) worldMutationFailure();
        return {
          dragonId: cityInteger(dragonDefinition(context.rules, dragon).level.id),
          level: num(dragon, "lv"),
          friendly: num(dragon, "friendly"),
        };
      })
    : [];
  const contents = javaMailBytes(
    JSON.stringify({
      battleGenerals: general
        ? [
            {
              userId: general.userId!.value,
              generalId: general.generalId!.value,
              level: general.level!.value,
              ...(general.skillList ? { skillList: general.skillList.value } : {}),
            },
          ]
        : [],
      arms: (army.soldiers ?? []).map((row) => ({
        armyId: row.armsId,
        armyNum: row.total - row.dead,
      })),
      pointId: String(state.target),
      pointType: 2,
      isTreasureMap: true,
      ...(dragons.length ? { defDrag: dragons } : {}),
    }),
  );
  if (!contents) worldMutationFailure();
  appendMail(context, {
    uid: randomUUID().replaceAll("-", "") + "00",
    owner: context.owner,
    fromName: "",
    title: "",
    type: 9,
    contents,
    extra: null,
    rewardId: null,
    rewardStatus: 1,
    reply: 0,
    createTime: context.now,
    itemIdFlag: 0,
  });
}
export function startTreasureExcavation(
  context: CityProgressionContext,
  state: RuntimeMarch,
  target: Row,
  original: Row,
) {
  const map = treasureMapRoster(context).find(
    (row) =>
      row.uuid === state.treasureUUID &&
      num(row, "targetId") === state.target &&
      num(row, "state") === 0,
  );
  if (!map || !treasureMapFree(target)) return undefined;
  const item = treasureMapItem(num(map, "colour"));
  if ((context.economy.quantity?.(item) ?? 0) < 1) return undefined;
  const rule = context.rules.world.heritage?.get(text(map, "treasureId"));
  if (!rule) worldMutationFailure();
  const seconds = cityInteger(rule.time, 1),
    reward = pinProgressionReward(context, rule.reward!);
  context.spendItem(item, 1);
  const finish = state.dueAt + BigInt(seconds) * 1000n;
  writeTreasureMap(context, {
    ...map,
    state: 1,
    marchId: state.id,
    time: seconds,
    startTime: state.dueAt,
    finishTime: finish,
  });
  encampMail(context, state, original);
  const write = (context.write.worldMutation ??= {});
  write.companionPushes = [
    ...(write.companionPushes ?? []),
    {
      command: "push.world.march.win",
      body: encode({
        uuid: sfs.string(state.id),
        o: sfs.string(text(context.state.profile, "name")),
        treasureMap: sfs.object(
          treasureMapOccupation({
            time: seconds,
            finishtime: finish,
            useitem: item,
            treasureuuid: text(map, "uuid"),
          }),
        ),
      }),
    },
  ];
  return { duration: BigInt(seconds) * 1000n, reward };
}
export function abandonTreasureExcavation(context: CityProgressionContext, state: RuntimeMarch) {
  const map = treasureMapRoster(context).find(
    (row) => row.uuid === state.treasureUUID && row.marchId === state.id && num(row, "state") === 1,
  );
  if (map) deleteTreasureMap(context, text(map, "uuid"));
}
export function finishTreasureExcavation(context: CityProgressionContext, state: RuntimeMarch) {
  const map = treasureMapRoster(context).find(
    (row) => row.uuid === state.treasureUUID && row.marchId === state.id && num(row, "state") === 1,
  );
  if (!map) return;
  const target =
    context.write.worldMutation?.points?.find((row) => num(row, "id") === state.target) ??
    context.state.worldMutation?.points.find((row) => num(row, "id") === state.target);
  if (
    !target ||
    num(target, "pointType") !== 2 ||
    target.ownerId !== context.owner ||
    target.ownerMarchUUid !== state.id
  )
    return;
  if (!state.treasureReward || long(map, "finishTime") !== state.dueAt) worldMutationFailure();
  const template = context.rules.mail.get("11616"),
    contents = javaMailBytes(template?.message);
  if (!template || !contents) worldMutationFailure();
  appendMail(context, {
    uid: randomUUID().replaceAll("-", "") + "00",
    owner: context.owner,
    fromName: template.sender ?? "",
    title: template.title ?? "",
    type: 2,
    contents,
    extra: null,
    rewardId: state.treasureReward,
    rewardStatus: 0,
    reply: 0,
    createTime: context.now,
  });
  deleteTreasureMap(context, text(map, "uuid"));
}
