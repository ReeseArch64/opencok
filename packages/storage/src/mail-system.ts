import { DependencyError } from "@opencok/errors/dependency";

const sentField = "chat_user_hassendmail";

const counterField = "chat_user_sendtimemail";

const commitPage = `local values = redis.call('HMGET', KEYS[1], ARGV[1], ARGV[2])
if (values[1] or '') ~= ARGV[3] or (values[2] or '') ~= ARGV[4] then return 0 end
redis.call('HSET', KEYS[1], ARGV[1], ARGV[5], ARGV[2], ARGV[6])
return 1`;

function javaSplit(value: string, separator: string): string[] {
  const parts = value.split(separator);

  while (parts.length && parts.at(-1) === "") parts.pop();

  return parts;
}

export async function selectSystemMailPage(
  command: (name: string, ...args: string[]) => Promise<unknown>,
  kingdomId: number,
  owner: string,
  input: readonly string[],
  count: number,
  time: bigint,
  inspect: (indices: readonly number[], more: boolean) => void,
): Promise<void> {
  if (
    !Number.isInteger(kingdomId) ||
    kingdomId < 1 ||
    kingdomId > 2147483647 ||
    !owner ||
    owner.length > 40 ||
    owner.includes("\0") ||
    !owner.isWellFormed() ||
    !Array.isArray(input) ||
    input.length > 10000 ||
    new Set(input).size !== input.length ||
    input.some((id) => !id || id.length > 40 || /[:,\0]/.test(id) || !id.isWellFormed()) ||
    !Number.isInteger(count) ||
    count < -2147483648 ||
    count > 2147483647 ||
    typeof time !== "bigint" ||
    BigInt.asIntN(64, time) !== time ||
    typeof inspect !== "function"
  )
    throw new DependencyError("mail pagination");

  const ids = [...input];
  const key = `opencok:kingdom:${kingdomId}:chat-user-info:${owner}`;

  for (let attempt = 0; attempt < 5; attempt++) {
    const values = await command("HMGET", key, sentField, counterField);

    if (
      !Array.isArray(values) ||
      values.length !== 2 ||
      values.some(
        (value) =>
          value !== null && (typeof value !== "string" || Buffer.byteLength(value) > 1024 * 1024),
      )
    )
      throw new DependencyError("mail pagination");

    const previous = values.map((value) => value ?? "") as [string, string];
    let nextSent = previous[0];
    let indices = ids.map((_, index) => index);
    let more = false;

    if (ids.length > count) {
      const sent = new Set<string>();
      const parts = javaSplit(previous[0], ":");

      if (time !== 0n && parts.length === 2) {
        if (
          !/^[+-]?\d+$/.test(parts[0]!) ||
          BigInt.asIntN(64, BigInt(parts[0]!)) !== BigInt(parts[0]!)
        )
          throw new DependencyError("mail pagination");

        if (BigInt(parts[0]!) === time)
          for (const id of javaSplit(parts[1]!, ","))
            if (
              [...id].some((character) => {
                const code = character.charCodeAt(0);

                return !(
                  (code >= 9 && code <= 13) ||
                  (code >= 28 && code <= 32) ||
                  code === 0x1680 ||
                  code === 0x180e ||
                  (code >= 0x2000 && code <= 0x2006) ||
                  (code >= 0x2008 && code <= 0x200a) ||
                  [0x2028, 0x2029, 0x205f, 0x3000].includes(code)
                );
              })
            )
              sent.add(id);
      }

      indices = [];

      for (const [index, id] of ids.entries()) {
        if (sent.has(id)) continue;

        indices.push(index);
        sent.add(id);

        if (indices.length >= count) break;
      }

      more = indices.length >= count;

      if (sent.size && time !== 0n) nextSent = `${time}:${[...sent].join(",")},`;

      if (Buffer.byteLength(nextSent) > 1024 * 1024) throw new DependencyError("mail pagination");
    }

    let counter = 0;
    const parts = javaSplit(previous[1], ":");

    if (parts[0] === String(time) && parts[1] && /^[+-]?\d+$/.test(parts[1])) {
      const value = BigInt(parts[1]);

      if (BigInt.asIntN(32, value) === value) counter = Number(value);
    }

    const nextCounter = `${time}:${(counter + 1) | 0}`;
    inspect(indices, more);
    const result = await command(
      "EVAL",
      commitPage,
      "1",
      key,
      sentField,
      counterField,
      previous[0],
      previous[1],
      nextSent,
      nextCounter,
    );

    if (result === 1) return;

    if (result !== 0) throw new DependencyError("mail pagination");
  }

  throw new DependencyError("mail pagination contention");
}
