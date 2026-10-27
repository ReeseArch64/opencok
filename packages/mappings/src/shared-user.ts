import type { Row } from "@opencok/contracts/rows";
import type { SharedUserUpdate } from "@opencok/contracts/shared-user";
import type { Rules } from "@opencok/rules/game";
import { sharedSearchProfile } from "@opencok/rules/player-search";
import { sharedUserInfoSchema } from "@opencok/validations/shared-user";
import { Type, type Fields } from "@opencok/messages/sfs";
import { playerSearchEntry } from "./player-search.ts";
import { validateFields } from "./validation.ts";

const keys = [
  "uid",
  "name",
  "pic",
  "picVer",
  "picfraId",
  "power",
  "abbr",
  "lang",
  "mainBuildingLevel",
  "allianceId",
  "gmFlag",
  "crossFightSrcServerId",
  "vipLevel",
  "svipLevel",
  "vipEndTime",
  "offLineTime",
  "rank",
] as const;

export function sharedUserInfo(
  row: Row,
  rules: Pick<Rules, "power">,
  kingdomId: number,
  version: bigint,
  now: number,
): SharedUserUpdate {
  if (typeof version !== "bigint" || version <= 0n || version > 9223372036854775807n)
    {throw new Error("Invalid shared user version");}

  const profile = sharedSearchProfile(row, rules, now);
  const entry = playerSearchEntry({ kingdomId, remote: true, data: profile });
  const fields: Fields = {};

  for (const key of keys) {if (entry[key]) {fields[key] = entry[key]!;}}

  validateFields(sharedUserInfoSchema, fields);
  const parts = Object.entries(fields).map(([key, field]) => {
    if (field.type === Type.String) {return `${JSON.stringify(key)}:${JSON.stringify(field.value)}`;}

    if (field.type === Type.Int || field.type === Type.Long)
      {return `${JSON.stringify(key)}:${String(field.value)}`;}

    throw new Error("Invalid shared user field");
  });
  const body = `{${parts.join(",")}}`;

  if (Buffer.byteLength(body) > 65535) {throw new Error("Oversized shared user profile");}

  return {
    owner: String(profile.uid),
    kingdomId,
    version,
    updatedAt: String(BigInt(now) / 1000n),
    body,
  };
}
