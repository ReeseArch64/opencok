import type { DragonRankingEntry, DragonRankingTeam } from "@opencok/contracts/dragon-ranking";
import { decodeStoredJson } from "@opencok/messages/stored-json";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

function invalid(): never {
  throw new GameError(errors.unsupported, "ranking");
}

export function decodeDragonRanking(entries: readonly DragonRankingEntry[]): DragonRankingTeam[] {
  if (!Array.isArray(entries) || entries.length > 32767) return invalid();
  let bytes = 0;
  return entries.map((entry) => {
    if (
      !entry ||
      typeof entry.json !== "string" ||
      !Number.isInteger(entry.rank) ||
      (entry.rank | 0) !== entry.rank
    )
      return invalid();
    const data = Buffer.from(entry.json);
    bytes += data.length;
    if (bytes > 4 * 1024 * 1024) return invalid();
    const parsed = decodeStoredJson(data);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return invalid();
    const object = parsed as Record<string, unknown>;
    const string = (key: string, required = false) => {
      const value = object[key];
      if (value === undefined || value === null) return required ? invalid() : "";
      if (typeof value === "string") return value;
      if (typeof value === "boolean" || typeof value === "bigint" || typeof value === "number")
        return String(value);
      return invalid();
    };
    const integer = (key: string, bits: 32 | 64): bigint => {
      const value = object[key];
      if (value === undefined || value === null) return 0n;
      if (typeof value === "bigint")
        return BigInt.asIntN(bits, value) === value ? value : invalid();
      if (typeof value === "number" && Number.isSafeInteger(value))
        return BigInt.asIntN(bits, BigInt(value)) === BigInt(value) ? BigInt(value) : invalid();
      if (typeof value === "string" && /^[+-]?\d+$/.test(value)) {
        const number = BigInt(value);
        if (BigInt.asIntN(bits, number) === number) return number;
      }
      return invalid();
    };
    return {
      teamId: string("teamId", true),
      name: string("teamName"),
      leader: string("leaderName"),
      teamState: Number(integer("state", 32)),
      score: Number(integer("score", 32)),
      kingId: Number(integer("kingId", 32)),
      kingName: string("kingName"),
      fightNum: Number(integer("fightNum", 32)),
      winNum: Number(integer("winNum", 32)),
      curmember: Number(integer("curmember", 32)),
      maxmember: Number(integer("maxmember", 32)),
      fighting: Number(integer("fighting", 32)),
      fightPower: integer("fightPower", 64),
      icon: string("icon"),
      rankNum: (entry.rank + 1) | 0,
      abbr: string("abbr"),
    };
  });
}
