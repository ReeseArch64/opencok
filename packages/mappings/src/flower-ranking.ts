import type {
  FlowerRankingPublication,
  FlowerRankingState,
} from "@opencok/contracts/flower-ranking";
import { decodeLegacyJsonObject } from "@opencok/messages/legacy-json";
import { sfs, Type, type Fields } from "@opencok/messages/sfs";
import { flowerRankingSchema } from "@opencok/validations/flower-ranking";
import { validateFields } from "./validation.ts";
import { javaDecimal } from "@opencok/rules/java-integer";

export function flowerRankingEntries(entries: readonly string[]): { uid: string; score: number }[] {
  if (entries.length > 32767) throw new Error("Oversized flower ranking");
  return entries.map((entry) => {
    const row = decodeLegacyJsonObject(entry);
    if (row.uid?.type !== Type.String || row.scoreVal?.type !== Type.Int)
      throw new Error("Invalid flower ranking row");
    return { uid: row.uid.value as string, score: row.scoreVal.value as number };
  });
}
export function flowerRanking(
  publication: FlowerRankingPublication,
  state: FlowerRankingState,
  uid: string,
  refreshTime: bigint,
  global: boolean,
): Fields {
  const entries = flowerRankingEntries(publication.local);
  const profiles = new Map(state.profiles.map((row) => [row.uid, row]));
  const result: Fields = {
    selfRanking: sfs.int(publication.selfRank),
    flowerRanking: sfs.array(
      entries.flatMap((entry) => {
        const profile = profiles.get(entry.uid);
        if (!profile) return [];
        return [
          sfs.object({
            uid: sfs.string(entry.uid),
            name: sfs.string(String(profile.name ?? "")),
            pic: sfs.string(String(profile.pic ?? "")),
            picVer: sfs.int(Number(javaDecimal(String(profile.picVer ?? 0), 32))),
            picfraId: sfs.int(Number(javaDecimal(String(profile.picfraId ?? 0), 32))),
            flowerVal: sfs.int(entry.score),
          }),
        ];
      }),
    ),
    refreshTime: sfs.long(refreshTime),
  };
  if (global) {
    let own = -1;
    const rows = publication.global.map((entry) => {
      const row = decodeLegacyJsonObject(entry);
      if (row.uid?.type !== Type.String || row.rank?.type !== Type.Int)
        throw new Error("Invalid global flower position");
      if (row.uid.value === uid) own = row.rank.value as number;
      return sfs.object(row);
    });
    result.rankGlobal = sfs.array(rows);
    result.myGRank = sfs.int(own);
    result.myHide = sfs.int(state.hide);
  }
  return validateFields(flowerRankingSchema, result);
}
