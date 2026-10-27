import type { GameStore } from "@opencok/contracts/game";
import { long, num } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { str, type Fields } from "@opencok/messages/sfs";
import { mailBlank } from "@opencok/rules/mail";
import { mysqlUtf8UnicodeKey } from "@opencok/rules/mysql-unicode";

export async function reportAvatar(
  db: GameStore,
  owner: string,
  kingdomId: number,
  params: Fields,
  now: number,
): Promise<Fields> {
  const profile = await db.getProfileById(owner);

  if (!profile) {throw new GameError(errors.missing);}

  if (
    profile.uid !== owner ||
    num(profile, "serverId") !== kingdomId ||
    num(profile, "banFlag") !== 0 ||
    long(profile, "banTime") > BigInt(now)
  )
    {throw new GameError(errors.invalid);}

  const target = str(params, "uid");

  if (
    typeof target !== "string" ||
    mailBlank(target) ||
    target.length > 255 ||
    target.includes("\0")
  )
    {throw new GameError(errors.invalid);}

  try {
    mysqlUtf8UnicodeKey(target);
  } catch {
    throw new GameError(errors.invalid);
  }

  if (!db.updateAvatarReport) {throw new GameError(errors.unsupported);}

  await db.updateAvatarReport(owner, target, now);

  return {};
}
