import { reconnectMarchBase } from "@opencok/mappings/reconnect-marches";
import { decodeWorldMarchArmy } from "@opencok/messages/world-resource-army";
import type { Rules } from "@opencok/rules/game";
import type { GameStore } from "@opencok/contracts/game";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import { int, sfs, str, type Fields } from "@opencok/messages/sfs";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

export function viewport(x: number, y: number, size: number): number[] {
  const ids = new Set<number>();
  for (let column = x - 13; column < x + 13; column++) {
    const offset = column - x + 13;
    const first = offset < 10 ? y - 4 - offset : y - 23 + offset;
    const count = offset < 10 ? (offset + 1) * 2 : offset < 16 ? 20 : (26 - offset) * 2;
    for (let row = first; row < first + count; row++) {
      if (column >= 0 && row >= 0 && column < size && row < size) ids.add(1 + column + row * size);
    }
  }
  ids.add(1 + x + y * size);
  return [...ids];
}
export function compactPoint(row: Row): string {
  if (![0, 1, 2, 3, 8].includes(num(row, "pointType")) || text(row, "territoryAlliance"))
    throw new GameError(errors.unsupported);
  const out: Record<string, string | number> = {
    i: num(row, "id"),
    t: num(row, "pointType"),
    l: num(row, "resLevel"),
    v: num(row, "resInitValue") - num(row, "resCostValue"),
  };
  if (row.pointItem != null) out.t1 = text(row, "pointItem");
  if (row.ownerName != null) out.o = text(row, "ownerName");
  if (text(row, "ownerId")) out.oid = text(row, "ownerId");
  if (text(row, "allianceId")) out.ai = text(row, "allianceId");
  if (out.t === 1 && Number(out.l) > 30) {
    out.sl = Number(out.l) - 30;
    out.l = 30;
  }
  for (const [output, input] of Object.entries({
    pt: "shieldTime",
    pt_resource: "resourceShieldTime",
    ft: "fireTime",
    rt: "flushTime",
    st: "startTime",
  })) {
    out[output] = Number(long(row, input) / 1000n);
  }
  return JSON.stringify(out);
}
export function pointSections(points: string[]): Fields {
  const sections: string[] = [];
  let section: string[] = [];
  for (const point of points) {
    if (Buffer.byteLength(point) > 15000) throw new GameError(errors.unsupported);
    if (Buffer.byteLength(JSON.stringify([...section, point])) > 31000) {
      sections.push(JSON.stringify(section));
      section = [];
    }
    section.push(point);
  }

  if (section.length || !sections.length) sections.push(JSON.stringify(section));
  return { section: sfs.int(sections.length), points: sfs.array(sections.map(sfs.string)) };
}
export class WorldService {
  constructor(
    readonly db: GameStore,
    readonly size: number,
    readonly kingdomId: number,
    readonly live?: {
      rules: Rules;
      subscribe(owner: string, x: number, y: number): Promise<void>;
      marches(ids: readonly number[]): Promise<readonly Row[]>;
    },
  ) {}
  async get(uid: string, params: Fields): Promise<Fields> {
    const x = int(params, "x");
    const y = int(params, "y");
    const mode = int(params, "type", 0);
    if (x < 0 || y < 0 || x >= this.size || y >= this.size || ![0, 1, 2].includes(mode))
      throw new GameError(errors.invalid);
    if (
      int(params, "serverId", this.kingdomId) !== this.kingdomId ||
      params.guide ||
      str(params, "extendMarchUuid", "")
    )
      throw new GameError(errors.unsupported);
    const ids = mode ? [1 + x + y * this.size] : viewport(x, y, this.size);
    const { world, points, hasMarches } = await this.db.getWorldByPointIds(uid, ids);
    if (!world || num(world, "worldId") !== 0 || (hasMarches && !this.live))
      throw new GameError(errors.unsupported);
    const byId = new Map(points.map((row) => [num(row, "id"), row]));
    const compact = ids.filter((id) => byId.has(id)).map((id) => compactPoint(byId.get(id)!));
    await this.live?.subscribe(uid, x, y);
    const marches = this.live ? await this.live.marches(ids) : [];
    if (marches.length > 1024) throw new GameError(errors.unsupported);
    return {
      ...pointSections(compact),
      m: sfs.array(
        marches.map((row) =>
          sfs.object(
            reconnectMarchBase(
              row,
              row.armyInfo ? decodeWorldMarchArmy(row.armyInfo as Buffer) : null,
              this.live!.rules,
              {
                serverId: this.kingdomId,
                miracle: false,
                miracleState: undefined,
                resourceBattle: false,
                siege: false,
              },
            ),
          ),
        ),
      ),
      serverId: sfs.int(this.kingdomId),
      x: sfs.int(x),
      y: sfs.int(y),
      timeStamp: sfs.int(int(params, "timeStamp")),
      moveCityTime: sfs.long(long(world, "lastMoveCityTime")),
    };
  }
}
