import type { GeneralAbility, PublicProfileState } from "@opencok/contracts/profile";
import { text } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { decodeStoredJson } from "@opencok/messages/stored-json";
import type { Rules } from "@opencok/rules/game";
import { publicGeneralPreviews } from "@opencok/rules/profile-generals";
import { publicGenerals } from "@opencok/mappings/profile";
import { publicAllianceInfo } from "@opencok/mappings/profile-alliance";
import { sfs, type Fields } from "@opencok/messages/sfs";

export function decodeGeneralAbilities(
  raw: unknown,
  publicPreview = true,
): readonly GeneralAbility[] {
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
        else if (key === "ids") {
          if (!publicPreview && value !== null && typeof value !== "string") throw new Error();

          tree[key] = publicPreview ? "" : (value as string | null);
        } else {
          if (
            publicPreview &&
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

export function publicProfileAlliance(
  state: PublicProfileState,
  rules: Rules,
  remote: boolean,
): Fields {
  if (!text(state.profile ?? {}, "allianceId").trim()) return {};

  if (
    !state.alliance ||
    text(state.alliance.alliance, "uid") !== text(state.profile!, "allianceId")
  )
    throw new GameError(errors.unsupported, "public_profile");

  let permissions: ReadonlyMap<string, number> | undefined;
  const raw = state.alliance.alliance.permission;

  if (raw !== null && raw !== undefined) {
    try {
      if (typeof raw !== "string") throw new Error();

      const decoded = decodeStoredJson(Buffer.from(raw));

      if (!decoded || typeof decoded !== "object" || Array.isArray(decoded)) throw new Error();

      permissions = new Map(
        Object.entries(decoded).map(([key, value]) => {
          if (key.length > 255) throw new Error();

          if (typeof value !== "bigint" && typeof value !== "number" && typeof value !== "string")
            throw new Error();

          if (
            typeof value === "string" &&
            !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(value)
          )
            throw new Error();

          const number = Number(value);

          if (!Number.isInteger(number) || number < -2147483648 || number > 2147483647)
            throw new Error();

          return [key, number];
        }),
      );
    } catch {
      throw new GameError(errors.unsupported, "public_profile");
    }
  }

  return { alliance: sfs.object(publicAllianceInfo(state.alliance, rules, remote, permissions)) };
}
