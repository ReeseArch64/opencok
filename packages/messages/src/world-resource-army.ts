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
function field(
  value: JavaObject,
  name: string,
  type: "I" | "Ljava/lang/String;" | "Ljava/util/List;",
): JavaValue {
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
  const decoded = decodeJavaObjectStream(data);
  if (decoded === null) return null;
  const root = checked(decoded, armyName, 1740992047662150684n, 2);
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
