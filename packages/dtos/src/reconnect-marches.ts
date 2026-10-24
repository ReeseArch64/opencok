import type { Row } from "@opencok/contracts/rows";
import type { SavedMarchArmy } from "@opencok/messages/world-resource-army";
import { decodeLegacyJsonArray } from "@opencok/messages/legacy-json";
import { sfs, Type, type Fields, type Value } from "@opencok/messages/sfs";
import type { Rules } from "@opencok/rules/game";
import { javaDecimal } from "@opencok/rules/java-integer";
import { mailBlank } from "@opencok/rules/mail";
import { javaHashMapOrder } from "@opencok/rules/java-hash-map-order";

const integer = (value: unknown) => Number(javaDecimal(String(value ?? 0), 32));
const long = (value: unknown) => {
  if (typeof value === "number" && !Number.isSafeInteger(value))
    throw new Error("Invalid march time");
  return javaDecimal(String(value ?? 0), 64);
};
const string = (value: unknown) => {
  if (typeof value !== "string") throw new Error("Invalid march identity");
  return value;
};

export function reconnectMarchDragon(row: Row | undefined, rules: Rules): Fields {
  if (!row) return { uuid: sfs.string(""), itemId: sfs.string(""), friendShip: sfs.int(0) };
  const rule = [...(rules.power.dragonLevels?.values() ?? [])].find(
    (rule) =>
      integer(rule.base_id) === integer(row.itemId) && integer(rule.level) === integer(row.lv),
  );
  if (!rule) throw new Error("Missing march dragon rule");
  const result: Fields = {
    userId: sfs.string(string(row.uid)),
    uuid: sfs.string(string(row.uuid)),
    itemId: sfs.string(String(integer(rule.id))),
    friendShip: sfs.int(integer(row.friendly)),
  };
  if (row.nickName !== null && row.nickName !== undefined)
    result.nickName = sfs.string(string(row.nickName));
  return result;
}

export function reconnectMarchGeneral(
  general: NonNullable<SavedMarchArmy["general"]>,
  skills: readonly Row[],
  now: bigint,
): Fields {
  const result: Fields = {
    userId: sfs.string(string(general.owner)),
    generalId: sfs.string(String(integer(general.id))),
    level: sfs.int(integer(general.level)),
  };
  const index = new Map(
    skills
      .filter((row) => row.uid === general.owner && integer(row.newGeneralId) === general.id)
      .map((row) => [string(row.skillId), row]),
  );
  const active = javaHashMapOrder(index.keys()).filter((id) => {
    const row = index.get(id)!;
    return integer(row.stat) === 3 && now <= long(row.actTime);
  });
  if (active.length) result.skillList = { type: Type.StringArray, value: active };
  return result;
}

export function reconnectMarchArmy(army: SavedMarchArmy | null, rules: Rules): Value[] {
  if (army === null) return [];
  if (army.soldiers === null) throw new Error("Missing saved march soldiers");
  const groups = new Map<
    number,
    { total: number; dead: number; knights: number; deadKnights: number }
  >();
  for (const soldier of army.soldiers) {
    const rule = rules.arms.get(soldier.armsId ?? "");
    let type = soldier.basicArm;
    if (type === null) {
      const arm = integer(rule?.arm);
      if (arm < 1 || arm > 8) throw new Error("Invalid march troop family");
      type = Math.floor((arm - 1) / 2);
    }
    const knight = integer(rule?.new_arms) !== 0;
    const group = groups.get(type) ?? { total: 0, dead: 0, knights: 0, deadKnights: 0 };
    group.total = (group.total + integer(soldier.total)) | 0;
    group.dead = (group.dead + integer(soldier.dead)) | 0;
    if (knight) {
      group.knights = (group.knights + integer(soldier.total)) | 0;
      group.deadKnights = (group.deadKnights + integer(soldier.dead)) | 0;
    }
    groups.set(type, group);
  }
  return [...groups].map(([type, group]) =>
    sfs.object({
      armId: sfs.int(type),
      knight_total: sfs.int(group.knights),
      knight_dead: sfs.int(group.deadKnights),
      total: sfs.int(group.total),
      dead: sfs.int(group.dead),
    }),
  );
}

export function reconnectMarchBase(
  row: Row,
  army: SavedMarchArmy | null,
  rules: Rules,
  context: {
    serverId: number;
    miracle: boolean;
    miracleState: Row | undefined;
    resourceBattle: boolean;
    siege: boolean;
  },
): Fields {
  const type = integer(row.type);
  const state = integer(row.state);
  if (state < 0 || state > 2) throw new Error("Invalid march state");
  const fields: Fields = {
    uuid: sfs.string(string(row.uuid)),
    o: sfs.string(string(row.ownerName ?? "")),
    ouid: sfs.string(string(row.ownerUid)),
    mType: sfs.int(type),
    tType: sfs.int(integer(row.targetType)),
    sType: sfs.int(state),
    color: sfs.int(integer(row.ownerColor)),
    sp: sfs.int(integer(row.ownerId)),
    dp: sfs.int(integer(row.targetId)),
    extraParam: sfs.int(integer(row.extraParam)),
    serverId: sfs.int(integer(context.serverId)),
    slowDown: sfs.bool(integer(row.slowDown) === 1),
    isDuel: sfs.int(integer(row.isDuelSkill)),
  };
  if (!context.miracle || context.miracleState) {
    fields.territoryStartTime = sfs.long(
      long(context.miracle ? context.miracleState!.starttime : row.territoryStartTime),
    );
    fields.territoryUpdateTime = sfs.long(
      long(context.miracle ? context.miracleState!.updatetime : row.territoryUpdateTime),
    );
    fields.territoryStat = sfs.int(
      integer(context.miracle ? context.miracleState!.state : row.territoryStat),
    );
  }
  if (!mailBlank(row.plunderRes as string | null) || !mailBlank(row.retrieveRes as string | null))
    fields.plunderRes = sfs.string(string(row.plunderRes));
  let start = 0n;
  let end = long(row.arrivalTime);
  if (state === 0) start = long(row.marchStartTime);
  else if (state === 1) end = 0n;
  else {
    const returning = long(row.returnStartTime);
    const arrival = long(row.marchArrivalTime);
    start = returning < arrival ? BigInt.asIntN(64, 2n * returning - arrival) : returning;
    fields.sp = sfs.int(integer(row.targetId));
    fields.dp = sfs.int(integer(row.ownerId));
    const remaining =
      army?.soldiers?.reduce((total, soldier) => (total + soldier.total - soldier.dead) | 0, 0) ??
      0;
    if (
      army === null ||
      context.siege ||
      !(remaining > 0 || [1, 3, 9, 10, 12, 13, 17].includes(type) || context.resourceBattle)
    )
      end = 0n;
  }
  fields.st = sfs.long(start);
  fields.et = sfs.long(end);
  fields.mt = sfs.int(integer(row.marchTime));
  if (!context.siege && !mailBlank(row.blackLandMarchTime as string | null))
    fields.mt2 = sfs.array(decodeLegacyJsonArray(string(row.blackLandMarchTime)));
  fields.army = sfs.array(reconnectMarchArmy(army, rules));
  if (context.siege) {
    fields.monsterCount = sfs.int(integer(row.monsterArmyCount));
    fields.monsterLevel = sfs.int(integer(row.monsterLevel));
  }
  if (context.resourceBattle) fields.occupyEndTime = sfs.long(long(row.occupyResourceEndTime));
  return fields;
}
