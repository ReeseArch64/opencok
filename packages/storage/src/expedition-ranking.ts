import type { ExpeditionRankingEntry } from "@opencok/contracts/expedition-ranking";
import { DependencyError } from "@opencok/errors/dependency";

const readBoard = `local pairing = redis.call('GET', KEYS[1])
if pairing ~= ARGV[1] then return {0} end
local scores = redis.call('ZREVRANGE', KEYS[2], 0, ARGV[2], 'WITHSCORES')
local result = {1}
local bytes = 0
for index = 1, #scores, 2 do
  local info = redis.call('HGET', KEYS[3], scores[index])
  local size = info and string.len(info) or 0
  bytes = bytes + size + string.len(scores[index]) + string.len(scores[index + 1])
  if size > 65535 or bytes > 1048576 then return {2} end
  result[#result + 1] = {scores[index], scores[index + 1], info or false}
end
return result`;

function invalid(): never {
  throw new DependencyError("redis");
}

export async function loadExpeditionRanking(
  command: (command: string, ...args: string[]) => Promise<unknown>,
  kingdomId: number,
  limit: number,
): Promise<ExpeditionRankingEntry[] | undefined> {
  if (
    !Number.isInteger(kingdomId) ||
    kingdomId < 1 ||
    kingdomId > 2147483647 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 32767
  )
    return invalid();
  const matchKey = `opencok:global:expedition-match:${kingdomId}`;
  for (let attempt = 0; attempt < 2; attempt++) {
    const raw = await command("GET", matchKey);
    if (raw === null) return undefined;
    if (typeof raw !== "string" || Buffer.byteLength(raw) > 65535) return invalid();
    let pairing: unknown;
    try {
      pairing = JSON.parse(raw);
    } catch {
      return invalid();
    }
    if (!pairing || typeof pairing !== "object" || Array.isArray(pairing)) return invalid();
    const record = pairing as Record<string, unknown>;
    const other = record.matchServerId;
    if (
      record.serverId !== kingdomId ||
      typeof other !== "number" ||
      !Number.isInteger(other) ||
      other < -2147483648 ||
      other > 2147483647 ||
      other === 0
    )
      return invalid();
    if (other < 0) return undefined;
    const owner = Math.min(kingdomId, other);
    const board = `opencok:kingdom:${owner}:expedition-ranking`;
    const response = await command(
      "EVAL",
      readBoard,
      "3",
      matchKey,
      board,
      `${board}-info`,
      raw,
      String(limit - 1),
    );
    if (!Array.isArray(response)) return invalid();
    if (response.length === 1 && response[0] === 0) continue;
    if (response[0] !== 1 || response.length > limit + 1) return invalid();
    const entries: ExpeditionRankingEntry[] = [];
    const seen = new Set<string>();
    let bytes = 0;
    for (const row of response.slice(1)) {
      if (!Array.isArray(row) || row.length !== 3) return invalid();
      const [uid, rawScore, info] = row;
      if (
        typeof uid !== "string" ||
        !uid.trim() ||
        uid.length > 255 ||
        seen.has(uid) ||
        typeof rawScore !== "string" ||
        (info !== null && typeof info !== "string")
      )
        return invalid();
      seen.add(uid);
      const score =
        rawScore === "inf" || rawScore === "+inf"
          ? Infinity
          : rawScore === "-inf"
            ? -Infinity
            : Number(rawScore);
      if (
        !/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(rawScore) &&
        !["inf", "+inf", "-inf"].includes(rawScore)
      )
        return invalid();
      if (
        Number.isNaN(score) ||
        (!Number.isFinite(score) && !["inf", "+inf", "-inf"].includes(rawScore))
      )
        return invalid();
      const size = info === null ? 0 : Buffer.byteLength(info);
      bytes += size + Buffer.byteLength(uid) + rawScore.length;
      if (size > 65535 || bytes > 1048576) return invalid();
      entries.push({ uid, score, info });
    }
    return entries;
  }
  return invalid();
}
