import type { PlayoffPublication } from "@opencok/contracts/battle-ranking";
import { DependencyError } from "@opencok/errors/dependency";

type Command = (name: string, ...args: string[]) => Promise<unknown>;

export async function loadBattleFightRanking(
  command: Command,
  realm: number,
): Promise<string | undefined> {
  if (!Number.isInteger(realm) || realm < 1) throw new DependencyError("battle ranking realm");

  const raw = await command("GET", `dragon_battle_tops_info_${realm}`);

  if (raw == null) return undefined;

  if (typeof raw !== "string" || new TextEncoder().encode(raw).length > 4194304)
    throw new DependencyError("battle ranking publication");

  return raw;
}

export async function loadPlayoffRanking(command: Command): Promise<PlayoffPublication> {
  const result = await command(
    "EVAL",
    `local version = redis.call('GET', 'dragon_playoff_version')
if not version then return {} end
return {redis.call('GET', 'dragon_playoff_state'), redis.call('GET', 'dragon_playoff_turns'), redis.call('GET', 'dragon_playoff_state_start_time'), redis.call('GET', 'dragon_playoff_state_duration'), redis.call('HVALS', 'dragon_playoff_teaminfo' .. version)}`,
    "0",
  );

  if (!Array.isArray(result) || result.length !== 5)
    throw new DependencyError("playoff publication unavailable");

  const numbers = result.slice(0, 4).map((raw) => {
    if (typeof raw !== "string" || !/^[+-]?\d+$/.test(raw))
      throw new DependencyError("playoff state");

    const value = BigInt(raw);

    if (BigInt.asIntN(64, value) !== value) throw new DependencyError("playoff state width");

    return value;
  });
  const [state, turns, start, duration] = numbers;

  if (state! < 0n || state! > 8n || turns! < 1n || turns! > 6n || duration! < 0n)
    throw new DependencyError("playoff period");

  const teams = result[4];

  if (!Array.isArray(teams) || teams.length > 64 || teams.some((raw) => typeof raw !== "string"))
    throw new DependencyError("playoff teams");

  if (teams.reduce((sum, raw) => sum + new TextEncoder().encode(raw).length, 0) > 4194304)
    throw new DependencyError("playoff size");

  return { state: Number(state), turns: Number(turns), start: start!, duration: duration!, teams };
}
