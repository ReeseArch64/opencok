import { DependencyError } from "@opencok/errors/dependency";

export async function loadGeneralDrawRanking(
  command: (name: string, ...args: string[]) => Promise<unknown>,
): Promise<readonly string[]> {
  const values = await command(
    "MGET",
    ...Array.from({ length: 1000 }, (_, index) => `GOLD_WHEEL_RANK_${index + 1}`),
  );

  if (!Array.isArray(values) || values.length !== 1000)
    {throw new DependencyError("general draw ranking publication");}

  const result: string[] = [];
  let size = 0;

  for (const value of values) {
    if (value === null) {break;}

    if (typeof value !== "string" || !value.isWellFormed() || Buffer.byteLength(value) > 4096)
      {throw new DependencyError("general draw ranking row");}

    size += Buffer.byteLength(value);

    if (size > 1048576) {throw new DependencyError("general draw ranking size");}

    result.push(value);
  }

  return result;
}
