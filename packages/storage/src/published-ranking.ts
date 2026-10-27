import { DependencyError } from "@opencok/errors/dependency";

type Command = (name: string, ...args: string[]) => Promise<unknown>;

function strings(values: unknown, limit: number): string[] {
  if (!Array.isArray(values) || values.length > limit) {throw new DependencyError("ranking list");}

  let bytes = 0;

  return values.map((value) => {
    if (typeof value !== "string" || !value.isWellFormed())
      {throw new DependencyError("ranking value");}

    bytes += Buffer.byteLength(value);

    if (bytes > 4 * 1024 * 1024) {throw new DependencyError("ranking size");}

    return value;
  });
}

export async function loadAttributeRanking(
  command: Command,
  kingdomId: number,
  type: number,
): Promise<string[]> {
  if (
    !Number.isInteger(kingdomId) ||
    kingdomId < 1 ||
    kingdomId > 2147483647 ||
    ![0, 1, 2].includes(type)
  )
    {throw new DependencyError("ranking selector");}

  const key = ["global_attack_wins_ranking", "global_defence_wins_ranking", "global_hp_ranking"][
    type
  ];
  const limit = type === 0 ? 151 : 30;

  return strings(await command("LRANGE", `${key}_${kingdomId}`, "0", String(limit - 1)), limit);
}

export async function loadPublishedGlobalRanking(
  command: Command,
  kind: "payment" | "consumption",
): Promise<string[]> {
  if (kind !== "payment" && kind !== "consumption") {throw new DependencyError("ranking kind");}

  const prefix = kind === "payment" ? "paytotal_global_rank_" : "continuedcost_global_rank_";
  const keys = Array.from({ length: 100 }, (_, index) => `${prefix}${index + 1}`);
  const values = await command("MGET", ...keys);

  if (!Array.isArray(values) || values.length !== 100)
    {throw new DependencyError("ranking publication");}

  const end = values.findIndex(
    (value) => value === null || (typeof value === "string" && /^\s*$/.test(value)),
  );

  return strings(values.slice(0, end === -1 ? values.length : end), 100);
}
