import { decodeLegacyJsonObject } from "@opencok/messages/legacy-json";
import { sfs, Type, type Fields } from "@opencok/messages/sfs";
import { militaryRankingSchema } from "@opencok/validations/military-ranking";
import { validateFields } from "./validation.ts";

export function militaryRanking(
  entries: readonly string[],
  uid: string,
  realm: number,
  type: number,
): Fields {
  if (entries.length > 151 || ![0, 1].includes(type)) throw new Error("Invalid military ranking");
  let self = 0;
  const rows = entries.map((entry, index) => {
    const row = decodeLegacyJsonObject(entry);
    for (const key of ["serverId", "uid", "serverName", "name", "pic", "abbr"])
      if (row[key]?.type !== Type.String) throw new Error("Invalid military presentation");
    for (const key of type === 0 ? ["militaryScore"] : ["rankingExp", "militaryRank"])
      if (row[key]?.type !== Type.Int) throw new Error("Invalid military metric");
    row.ranking = sfs.int(index + 1);
    if (row.uid!.value === uid && row.serverId!.value === String(realm)) self = index + 1;
    return sfs.object(row);
  });
  return validateFields(militaryRankingSchema, {
    playerArr: sfs.array(rows),
    selfRanking: sfs.int(self),
  });
}
