import type {
  ExpeditionRankingCandidate,
  ExpeditionRankingResult,
} from "@opencok/contracts/expedition-ranking";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { Rules } from "./game.ts";

function invalid(): never {
  throw new GameError(errors.unsupported, "ranking");
}
function integer(value: unknown, bits: 32 | 64): bigint {
  if (typeof value === "number" && !Number.isSafeInteger(value)) return invalid();
  if (!/^[+-]?\d+$/.test(String(value))) return invalid();
  const parsed = BigInt(String(value));
  if (BigInt.asIntN(bits, parsed) !== parsed) return invalid();
  return parsed;
}

export function expeditionRankingLimit(rules: Rules): number {
  const limit = Number(integer(rules.items.get("ranking")?.k2, 32));
  if (limit < 1 || limit > 32767) return invalid();
  return limit;
}

export function selectExpeditionRanking(
  uid: string,
  limit: number,
  candidates: readonly ExpeditionRankingCandidate[] | undefined,
): ExpeditionRankingResult | undefined {
  if (!uid.trim() || !Number.isInteger(limit) || limit < 1 || limit > 32767) return invalid();
  if (candidates === undefined || candidates.length === 0) return undefined;
  if (candidates.length > limit) return invalid();
  const rows: ExpeditionRankingResult["rows"] = [];
  const seen = new Set<string>();
  let selfRanking = -1;
  for (const { uid: player, score, profile } of candidates) {
    if (
      !player.trim() ||
      player.length > 255 ||
      seen.has(player) ||
      typeof score !== "number" ||
      Number.isNaN(score)
    )
      return invalid();
    seen.add(player);
    if (profile === undefined) continue;
    if (
      typeof profile.name !== "string" ||
      typeof profile.pic !== "string" ||
      typeof profile.abbr !== "string"
    )
      return invalid();
    const rank = rows.length + 1;
    rows.push({
      uid: player,
      rank,
      score: Math.max(-2147483648, Math.min(2147483647, Math.floor(score))),
      name: profile.name,
      pic: profile.pic,
      abbr: profile.abbr,
      picVer: Number(integer(profile.picVer, 32)),
      serverId: Number(integer(profile.serverId, 32)),
      power: integer(profile.power, 64),
    });
    if (player === uid) selfRanking = rank;
  }
  return { rows, selfRanking };
}
