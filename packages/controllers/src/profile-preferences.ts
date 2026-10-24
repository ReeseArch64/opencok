import type { GameStore } from "@opencok/contracts/game";
import { long, num } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { int, sfs, type Fields } from "@opencok/messages/sfs";

const preferences = {
  "equip.show": { field: "showEquip", key: "show" },
  "medal.show": { field: "showMedal", key: "show" },
  "march.soldier.show": { field: "marchSoldierShow", key: "show" },
  "colorblind.set": { field: "colorblind", key: "set" },
  "equip.scroll": { field: "scrollEquip", key: "setting" },
  "banner.set": { field: "showBanner", key: "set" },
  "speed.cd.open": { field: "clientSaveFlag", key: "open" },
} as const;

export async function profilePreference(
  db: GameStore,
  uid: string,
  command: keyof typeof preferences,
  params: Fields,
  now: number,
): Promise<Fields> {
  const profile = await db.getProfileById(uid);
  const optional = command === "banner.set" || command === "speed.cd.open";
  if (!profile) {
    if (optional) return {};
    throw new GameError(errors.missing);
  }
  if (long(profile, "banTime") > BigInt(now) || num(profile, "banFlag") !== 0)
    throw new GameError(errors.invalid);
  const { field, key } = preferences[command];
  if (optional && !Object.hasOwn(params, key)) return {};
  const readValue = () => {
    const value = int(params, key);
    if (!Number.isInteger(value) || value < -2147483648 || value > 2147483647)
      throw new GameError(errors.invalid);
    return value;
  };
  const eager = optional ? undefined : readValue();
  if (command === "equip.scroll" && eager !== 0 && eager !== 1) return {};
  if (!db.updateProfilePreference) throw new GameError(errors.unsupported);
  const value = await db.updateProfilePreference(uid, field, now, () => eager ?? readValue());
  if (command === "speed.cd.open" || value === undefined) return {};
  return command === "equip.scroll"
    ? { scrollEquip: sfs.bool(value === 1) }
    : { show: sfs.int(value) };
}
