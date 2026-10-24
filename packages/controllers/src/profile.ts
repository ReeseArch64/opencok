import type { GeneralAbility, PublicProfileState } from "@opencok/contracts/profile";
import { text } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { decodeStoredJson } from "@opencok/messages/stored-json";
import type { Rules } from "@opencok/rules/game";
import { publicGeneralPreviews } from "@opencok/rules/profile-generals";
import { publicGenerals } from "@opencok/dtos/profile";

export function decodeGeneralAbilities(raw: unknown): readonly GeneralAbility[] {
  if (raw === null || raw === undefined) return [];
  try {
    if (!Buffer.isBuffer(raw)) throw new Error();
    const records = decodeStoredJson(raw);
    if (!Array.isArray(records)) throw new Error();
    return records.map((record) => {
      if (record === null || typeof record !== "object" || Array.isArray(record)) throw new Error();
      if (Object.hasOwn(record, "id") && record.id !== null && typeof record.id !== "string")
        throw new Error();
      const metadata = Object.hasOwn(record, "ids");
      const tree: Record<string, string | number | null> = Object.create(null);
      for (const [key, value] of Object.entries(record)) {
        if (key === "id") tree[key] = value as string | null;
        else if (key === "ids") tree[key] = "";
        else {
          if (
            metadata &&
            (record.id !== "50000" || !["602700", "601300", "601100", "601200"].includes(key))
          )
            continue;
          if (
            !/^\d+$/.test(key) ||
            BigInt(key) > 2147483647n ||
            typeof value !== "bigint" ||
            BigInt.asIntN(32, value) !== value
          )
            throw new Error();
          tree[key] = Number(value);
        }
      }
      return tree;
    });
  } catch {
    throw new GameError(errors.unsupported, "public_profile");
  }
}

export function publicProfileGenerals(state: PublicProfileState, rules: Rules, now: number) {
  if (!state.profile) throw new GameError(errors.unsupported, "public_profile");
  const abilities = new Map(
    state.generals.map((general) => [
      String(general.uuid),
      decodeGeneralAbilities(general.ability),
    ]),
  );
  return publicGenerals(
    publicGeneralPreviews(
      state.generals,
      state.skills,
      abilities,
      text(state.profile, "uid"),
      rules,
      now,
    ),
  );
}
