import type { Row } from "@opencok/contracts/rows";
import type { SavedMarchArmy } from "@opencok/messages/world-resource-army";
import { decodeLegacyJsonArray } from "@opencok/messages/legacy-json";
import { sfs, Type, fields as objectFields, type Fields, type Value } from "@opencok/messages/sfs";
import type { Rules } from "@opencok/rules/game";
import { javaDecimal } from "@opencok/rules/java-integer";
import { mailBlank } from "@opencok/rules/mail";
import { javaHashMapOrder, javaIntHashMapOrder } from "@opencok/rules/java-hash-map-order";

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

export interface ReconnectMarchView {
  row: Row;
  base: Fields;
  petDragon: Fields | undefined;
  dragon: Fields | undefined;
  hasDragon: boolean;
  general: Fields | undefined;
  late: Fields;
  extras: Fields;
  team: { leader: string; members: readonly string[]; createdAt: bigint } | undefined;
}

export function reconnectMarches(
  views: readonly ReconnectMarchView[],
  owner: string,
  now: bigint,
): Fields {
  const index = new Map<string, ReconnectMarchView>();
  for (const view of views) {
    const id = string(view.row.uuid);
    if (index.has(id)) throw new Error("Duplicate reconnect march");
    index.set(id, view);
  }
  const project = (view: ReconnectMarchView, visiting: Set<string>): Fields => {
    const id = string(view.row.uuid);
    if (visiting.has(id) || visiting.size > 1) throw new Error("Cyclic reconnect team");
    visiting.add(id);
    let result = { ...view.base };
    const dragons: Fields[] = view.hasDragon && view.petDragon ? [view.petDragon] : [];
    const generals: Fields[] = view.general ? [view.general] : [];
    if (view.petDragon) result.petDragon = sfs.object(view.petDragon);
    const team = view.team;
    if (team) {
      if (new Set(team.members).size !== team.members.length || team.members.includes(team.leader))
        throw new Error("Duplicate reconnect team members");
      const leader = index.get(team.leader);
      if (!leader) throw new Error("Missing reconnect team leader");
      const members = team.members.map((id) => {
        const member = index.get(id);
        if (
          !member ||
          member.row.teamId !== view.row.teamId ||
          member.row.worldId !== view.row.worldId
        )
          throw new Error("Inconsistent reconnect team member");
        return member;
      });
      if (leader.row.teamId !== view.row.teamId || leader.row.worldId !== view.row.worldId)
        throw new Error("Inconsistent reconnect team leader");
      result.team = sfs.string(team.leader);
      const type = integer(view.row.type);
      const state = integer(view.row.state);
      if ([5, 16, 19].includes(type) && state !== 2 && now >= long(view.row.marchArrivalTime)) {
        if (id !== team.leader) result = { ...project(leader, visiting), uuid: sfs.string(id) };
      } else if ([4, 15, 18].includes(type)) {
        const totals = new Map<number, { total: number; dead: number }>();
        for (const march of [leader, ...members]) {
          if (march.base.army?.type !== Type.Array) throw new Error("Invalid reconnect team army");
          for (const entry of march.base.army.value as Value[]) {
            const army = objectFields(entry);
            const arm = integer(army.armId?.value);
            const total = totals.get(arm) ?? { total: 0, dead: 0 };
            total.total = (total.total + integer(army.total?.value)) | 0;
            total.dead = (total.dead + integer(army.dead?.value)) | 0;
            totals.set(arm, total);
          }
        }
        result.army = sfs.array(
          javaIntHashMapOrder(totals.keys()).map((arm) =>
            sfs.object({
              armId: sfs.int(arm),
              total: sfs.int(totals.get(arm)!.total),
              dead: sfs.int(totals.get(arm)!.dead),
            }),
          ),
        );
        if (state === 2) result.leaderArmy = view.base.army!;
        if (now < long(view.row.marchStartTime)) result.sType = sfs.int(1);
      }
      result.tct = sfs.long(long(team.createdAt));
      if ([4, 15, 18].includes(type)) {
        for (const member of [
          leader,
          ...members.filter((member) => integer(member.row.state) === 1),
        ]) {
          if (member.hasDragon && member.dragon) {
            const uuid = member.dragon.uuid?.value;
            if (typeof uuid !== "string") throw new Error("Invalid march dragon identity");
            if (!dragons.some((dragon) => dragon.uuid?.value === uuid)) dragons.push(member.dragon);
          }
          if (member.general) generals.push(member.general);
        }
      }
    }
    result.dragonList = sfs.array(dragons.map((dragon) => sfs.object(dragon)));
    result.generalList = sfs.array(generals.map((general) => sfs.object(general)));
    visiting.delete(id);
    return { ...result, ...view.late };
  };
  const own = views.filter((view) => view.row.ownerUid === owner);
  if (own.length > 32767) throw new Error("Oversized reconnect marches");
  return {
    worldMarch: sfs.array(
      own.map((view) =>
        sfs.object({
          ...project(view, new Set()),
          ...view.extras,
          oType: sfs.int(0),
        }),
      ),
    ),
  };
}
