import { MAX_FRAME } from "@opencok/messages/frame";
import type { WorldBulletinArchive } from "@opencok/contracts/world-bulletins";
import { sfs, int, encode, extension, type Fields } from "@opencok/messages/sfs";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

export async function worldFightBulletins(
  archive: WorldBulletinArchive,
  observer: string,
  params: Fields,
  kingdomId: number,
  now: number,
): Promise<Fields> {
  const start = int(params, "start"),
    end = int(params, "end"),
    alliance = await archive.store.alliance(observer, kingdomId, now);

  if (!alliance) throw new GameError(errors.invalid);

  const rows = await archive.page(alliance, start, end);

  if (!Array.isArray(rows) || rows.length > 4096) throw new GameError(errors.unsupported);

  let bytes = 0;

  for (const row of rows) {
    if (typeof row !== "string" || !row.isWellFormed()) throw new GameError(errors.unsupported);

    const length = Buffer.byteLength(row);
    bytes += length;

    if (length > 32767 || bytes > 1048576) throw new GameError(errors.unsupported);
  }

  const body = { result: sfs.array(rows.map(sfs.string)) };

  if (encode(extension("al.fight.bulletin", body)).length > MAX_FRAME)
    throw new GameError(errors.unsupported);

  return body;
}
