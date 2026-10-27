import { sfs, type Fields } from "@opencok/messages/sfs";
import type { GoldEggsCell, GoldEggsStanding } from "@opencok/contracts/gold-eggs";
export function goldEggsCellsView(cells: readonly GoldEggsCell[]) {
  if (cells.length > 64) throw new Error("Gold eggs cell projection bound exceeded");
  return sfs.array(
    cells.map((cell) =>
      sfs.object({
        id: sfs.string(cell.id),
        type: sfs.int(cell.type),
        state: sfs.bool(cell.smashed),
      }),
    ),
  );
}
export function goldEggsRankingView(
  rows: readonly GoldEggsStanding[],
  owner: string,
  realm: number,
  global = false,
): Fields {
  if (rows.length > 150) throw new Error("Gold eggs ranking projection bound exceeded");
  const values = sfs.array(
    rows.map((row, index) =>
      sfs.object({
        ...(global ? { rank: sfs.int(index + 1) } : {}),
        uid: sfs.string(row.uid),
        createtime: sfs.long(row.createdAt),
        score: sfs.long(row.score),
        sid: sfs.string(String(row.kingdomId)),
        val: sfs.long(row.score),
        name: sfs.string(row.name),
        pic: sfs.string(row.pic),
        picVer: sfs.int(row.picVer),
        picfraId: sfs.int(row.picfraId),
        socre: sfs.long(row.score),
      }),
    ),
  );
  return global
    ? { allRank: values }
    : {
        selfRanking: sfs.int(
          rows.findIndex((row) => row.uid === owner && row.kingdomId === realm) + 1,
        ),
        serverRanking: values,
      };
}
