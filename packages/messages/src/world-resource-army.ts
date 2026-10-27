import { decodeJavaObjectStream, type JavaObject, type JavaValue } from "./java-object-stream.ts";
import { ProtocolError } from "./sfs.ts";

const armyName = "com.elex.cok.gameengine.world.march.WorldMarchGeneralArmy";
export interface SavedResourceSoldier {
  owner: string | null;
  armsId: string | null;
  total: number;
  dead: number;
  loadEffect: number;
}
export interface SavedResourceArmy {
  owner: string | null;
  cachedLoad: number;
  soldiers: SavedResourceSoldier[] | null;
}
function invalid(): never {
  throw new ProtocolError();
}
function object(value: JavaValue): JavaObject {
  if (!value || typeof value !== "object" || value.kind !== "object") return invalid();
  return value;
}
function checked(value: JavaValue, name: string, uid: bigint, flags: number): JavaObject {
  const result = object(value);
  const type = result.descriptor;
  if (type.name !== name || type.uid !== uid || type.flags !== flags || type.parent)
    return invalid();
  return result;
}
function field(value: JavaObject, name: string, type: string): JavaValue {
  const declaration = value.descriptor.fields.find((entry) => entry.name === name);
  if (!declaration) return type === "I" ? 0 : null;
  if ((declaration.signature ?? declaration.type) !== type) return invalid();
  return value.slots.get(value.descriptor)!.fields.get(name)!;
}
function text(value: JavaValue): string | null {
  if (value !== null && typeof value !== "string") return invalid();
  return value;
}
function list(value: JavaValue): JavaValue[] | null {
  if (value === null) return null;
  const source = object(value);
  const type = source.descriptor;
  const arrayList = type.name === "java.util.ArrayList";
  const linkedList = type.name === "java.util.LinkedList";
  if (!arrayList && !linkedList) return invalid();
  checked(source, type.name, arrayList ? 8683452581122892189n : 876323262645176354n, 3);
  const slot = source.slots.get(type)!;
  const header = slot.custom[0];
  if (!header || typeof header !== "object" || header.kind !== "block" || header.bytes.length !== 4)
    return invalid();
  const count = header.bytes.readInt32BE();
  if (count < 0 || count > 4096 || slot.custom.length !== count + 1) return invalid();
  if (arrayList && field(source, "size", "I") !== count) return invalid();
  return slot.custom.slice(1);
}
export function decodeWorldResourceArmy(data: Buffer): SavedResourceArmy | null {
  if (isMaintainedMarchArmy(data)) {
    const army = readMaintainedMarchArmy(data);
    return {
      owner: army.owner,
      cachedLoad: army.cachedLoad,
      soldiers:
        army.soldiers?.map(({ basicArm: _basicArm, level: _level, ...soldier }) => soldier) ?? null,
    };
  }
  const decoded = decodeJavaObjectStream(data);
  if (decoded === null) return null;
  const root = checked(decoded, armyName, 1740992047662150684n, 2);
  return resourceArmy(root);
}

function resourceArmy(root: JavaObject): SavedResourceArmy {
  const soldiers = list(field(root, "soldierList", "Ljava/util/List;"));
  return {
    owner: text(field(root, "userId", "Ljava/lang/String;")),
    cachedLoad: field(root, "armyLoad", "I") as number,
    soldiers:
      soldiers?.map((value) => {
        const soldier = checked(value, `${armyName}$Soldier`, -1404739455579587157n, 2);
        return {
          owner: text(field(soldier, "userId", "Ljava/lang/String;")),
          armsId: text(field(soldier, "armsId", "Ljava/lang/String;")),
          total: field(soldier, "total", "I") as number,
          dead: field(soldier, "dead", "I") as number,
          loadEffect: field(soldier, "loadEffectVal", "I") as number,
        };
      }) ?? null,
  };
}

export interface SavedMarchArmy extends Omit<SavedResourceArmy, "soldiers"> {
  soldiers: (SavedResourceSoldier & { basicArm: number | null; level?: number })[] | null;
  dragons: { owner: string | null; uuid: string | null; itemId: number; level: number }[] | null;
  general: { owner: string | null; id: number; level: number } | null;
}

export function decodeWorldMarchArmy(data: Buffer): SavedMarchArmy | null {
  if (isMaintainedMarchArmy(data)) return readMaintainedMarchArmy(data);
  const decoded = decodeJavaObjectStream(data);
  if (decoded === null) return null;
  const root = checked(decoded, armyName, 1740992047662150684n, 2);
  const army = resourceArmy(root);
  const soldiers = list(field(root, "soldierList", "Ljava/util/List;"));
  const dragons = list(field(root, "dragonList", "Ljava/util/List;"));
  const savedGeneral = field(
    root,
    "fightNewGeneral",
    `L${armyName.replaceAll(".", "/")}$FightNewGeneral;`,
  );
  const general =
    savedGeneral === null
      ? null
      : checked(savedGeneral, `${armyName}$FightNewGeneral`, -7546450651339456017n, 2);
  return {
    owner: army.owner,
    cachedLoad: army.cachedLoad,
    soldiers:
      soldiers?.map((value, index) => {
        const soldier = object(value);
        const type = field(
          soldier,
          "basicArmType",
          `L${armyName.replaceAll(".", "/")}$BasicArmType;`,
        );
        let basicArm: number | null = null;
        if (type !== null) {
          if (
            typeof type !== "object" ||
            type.kind !== "enum" ||
            type.descriptor.name !== `${armyName}$BasicArmType`
          )
            return invalid();
          basicArm = ["INFANTRY", "CAVALRY", "BOW", "CAR"].indexOf(type.name);
          if (basicArm < 0) return invalid();
        }
        return {
          ...army.soldiers![index]!,
          basicArm,
          ...(soldier.descriptor.fields.some((field) => field.name === "level")
            ? { level: field(soldier, "level", "I") as number }
            : {}),
        };
      }) ?? null,
    dragons:
      dragons?.map((value) => {
        const dragon = checked(value, `${armyName}$FightDragon`, -7126474412733967892n, 2);
        return {
          owner: text(field(dragon, "userId", "Ljava/lang/String;")),
          uuid: text(field(dragon, "drgUUID", "Ljava/lang/String;")),
          itemId: field(dragon, "itemId", "I") as number,
          level: field(dragon, "level", "I") as number,
        };
      }) ?? null,
    general:
      general === null
        ? null
        : {
            owner: text(field(general, "userId", "Ljava/lang/String;")),
            id: field(general, "id", "I") as number,
            level: field(general, "level", "I") as number,
          },
  };
}

const maintainedMarchPrefix = Buffer.from("OCMA1\0");
export function isMaintainedMarchArmy(data: Buffer) {
  return (
    Buffer.isBuffer(data) &&
    data.subarray(0, maintainedMarchPrefix.length).equals(maintainedMarchPrefix)
  );
}
function readMaintainedMarchArmy(data: Buffer): SavedMarchArmy {
  if (!Buffer.isBuffer(data) || data.length > 65535) return invalid();
  const army = JSON.parse(
    new TextDecoder("utf-8", { fatal: true }).decode(data.subarray(maintainedMarchPrefix.length)),
  ) as SavedMarchArmy;
  const integer = (value: unknown, minimum = -2147483648) =>
    typeof value === "number" && Number.isInteger(value) && value >= minimum && value <= 2147483647;
  if (
    !army ||
    typeof army !== "object" ||
    typeof army.owner !== "string" ||
    !army.owner ||
    army.owner.length > 40 ||
    !army.owner.isWellFormed() ||
    !integer(army.cachedLoad, 0) ||
    !Array.isArray(army.soldiers) ||
    army.soldiers.length > 256 ||
    !Array.isArray(army.dragons) ||
    army.dragons.length > 8
  )
    return invalid();
  for (const soldier of army.soldiers)
    if (
      soldier.owner !== army.owner ||
      typeof soldier.armsId !== "string" ||
      !/^\d{1,12}$/.test(soldier.armsId) ||
      !integer(soldier.total, 1) ||
      !integer(soldier.dead, 0) ||
      soldier.dead > soldier.total ||
      !integer(soldier.loadEffect) ||
      (soldier.level !== undefined && !integer(soldier.level, 0)) ||
      !(soldier.basicArm === null || integer(soldier.basicArm, 0))
    )
      return invalid();
  for (const dragon of army.dragons)
    if (
      dragon.owner !== army.owner ||
      typeof dragon.uuid !== "string" ||
      !dragon.uuid ||
      dragon.uuid.length > 40 ||
      !integer(dragon.itemId, 1) ||
      !integer(dragon.level, 1)
    )
      return invalid();
  if (
    army.general !== null &&
    (army.general.owner !== army.owner ||
      !integer(army.general.id, 1) ||
      !integer(army.general.level, 1))
  )
    return invalid();
  return army;
}
export function encodeWorldMarchArmy(army: SavedMarchArmy): Buffer {
  const data = Buffer.concat([maintainedMarchPrefix, Buffer.from(JSON.stringify(army), "utf8")]);
  readMaintainedMarchArmy(data);
  return data;
}

export function decodeWorldMarchSpeedEffects(
  data: Buffer,
): ReadonlyMap<string, number> | undefined {
  if (isMaintainedMarchArmy(data)) return undefined;
  const decoded = decodeJavaObjectStream(data);
  if (decoded === null) return undefined;
  const root = checked(decoded, armyName, 1740992047662150684n, 2);
  const soldiers = list(field(root, "soldierList", "Ljava/util/List;"));
  const result = new Map<string, number>();
  for (const value of soldiers ?? []) {
    const soldier = checked(value, `${armyName}$Soldier`, -1404739455579587157n, 2);
    const id = text(field(soldier, "armsId", "Ljava/lang/String;"));
    if (!id) invalid();
    const effect = field(soldier, "marchSpdEffectVal", "I") as number;
    result.set(id, Math.min(result.get(id) ?? effect, effect));
  }
  return result;
}
