import type { createDatabases } from "@opencok/drizzle";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { translationv2 } from "@opencok/drizzle/schema/opencok_kingdom/translationv2";
import { DependencyError } from "@opencok/errors/dependency";
import type { MailSender, MailTranslationLookup } from "@opencok/contracts/mail";
import { eq, inArray, sql } from "drizzle-orm";
import type { Database } from "./game.ts";

type Reader = Pick<Database["kingdom"]["db"], "select">;

const languages = [
  "en",
  "zh-Hans",
  "zh-Hant",
  "ja",
  "ko",
  "ru",
  "es",
  "ms",
  "fr",
  "de",
  "it",
  "pt",
] as const;

export async function readMailSenders(
  databases: ReturnType<typeof createDatabases>,
  kingdomId: number,
  local: Reader,
  uids: readonly string[],
): Promise<ReadonlyMap<string, MailSender>> {
  if (
    uids.length > 1000 ||
    new Set(uids).size !== uids.length ||
    uids.some((uid) => !uid || uid.length > 40 || uid.includes("\0") || !uid.isWellFormed())
  )
    throw new Error("Invalid mail sender query");

  const result = new Map<string, MailSender>();

  if (!uids.length) return result;

  const routes = await databases.global.db
    .select({ uid: account_new.gameUid, server: account_new.server })
    .from(account_new)
    .where(inArray(account_new.gameUid, [...uids]))
    .limit(uids.length + 1);

  if (
    routes.length > uids.length ||
    new Set(routes.map((row) => row.uid)).size !== routes.length ||
    routes.some((row) => !uids.includes(row.uid))
  )
    throw new DependencyError("mail sender routing");

  const directory = new Map(routes.map((row) => [row.uid, row.server]));
  const groups = new Map<number, string[]>();

  for (const uid of uids) {
    const server = directory.get(uid) ?? String(kingdomId);
    const realm = Number(server);

    if (
      !/^[+-]?\d+$/.test(server) ||
      !Number.isInteger(realm) ||
      realm < 1 ||
      realm > 2147483647 ||
      !databases.kingdoms.has(realm)
    )
      throw new DependencyError("mail sender realm");

    const members = groups.get(realm) ?? [];
    members.push(uid);
    groups.set(realm, members);
  }

  for (const [realm, ids] of groups) {
    const read = async (db: Reader) => {
      const rows = await db
        .select({
          uid: userprofile.uid,
          serverId: userprofile.serverId,
          name: userprofile.name,
          pic: userprofile.pic,
          picVer: userprofile.picVer,
          lang: userprofile.lang,
          abbr: alliance.abbr,
        })
        .from(userprofile)
        .leftJoin(alliance, eq(alliance.uid, userprofile.allianceId))
        .where(inArray(userprofile.uid, ids))
        .limit(ids.length + 1);

      if (
        rows.length > ids.length ||
        new Set(rows.map((row) => row.uid)).size !== rows.length ||
        rows.some((row) => !ids.includes(row.uid) || row.serverId !== realm)
      )
        throw new DependencyError("mail sender identity");

      for (const row of rows)
        result.set(row.uid, {
          name: row.name,
          pic: row.pic,
          picVer: String(row.picVer ?? 0),
          lang: realm === kingdomId ? (row.lang ?? "") : row.lang,
          abbr: row.abbr,
        });
    };

    if (realm === kingdomId) await read(local);
    else
      await databases
        .getKingdom(realm)
        .db.transaction(read, { isolationLevel: "repeatable read", accessMode: "read only" });
  }

  return result;
}

export async function readMailTranslations(db: Reader, requests: readonly MailTranslationLookup[]) {
  if (
    requests.length > 1000 ||
    requests.some(
      (request) =>
        !request.id ||
        request.id.length > 255 ||
        request.id.includes("\0") ||
        !request.id.isWellFormed() ||
        !(languages as readonly string[]).includes(request.language),
    )
  )
    throw new Error("Invalid mail translation query");

  const groups = new Map<(typeof languages)[number], Set<string>>();

  for (const request of requests) {
    const language = request.language as (typeof languages)[number];
    const ids = groups.get(language) ?? new Set<string>();
    ids.add(request.id);
    groups.set(language, ids);
  }

  const result: (MailTranslationLookup & { contents: Buffer | null })[] = [];
  let bytes = 0;

  for (const [language, set] of groups) {
    const ids = [...set];
    const column = translationv2[language];
    const sizes = await db
      .select({ id: translationv2.id, size: sql<number>`coalesce(octet_length(${column}), 0)` })
      .from(translationv2)
      .where(inArray(translationv2.id, ids))
      .limit(ids.length + 1);

    if (
      sizes.length > ids.length ||
      new Set(sizes.map((row) => row.id)).size !== sizes.length ||
      sizes.some((row) => !set.has(row.id) || !Number.isSafeInteger(row.size) || row.size < 0)
    )
      throw new Error("Invalid mail translation metadata");

    bytes += sizes.reduce((total, row) => total + row.size, 0);

    if (bytes > 4 * 1024 * 1024) throw new Error("Mail translation capacity exceeded");

    if (!sizes.length) continue;

    const rows = await db
      .select({ id: translationv2.id, contents: column })
      .from(translationv2)
      .where(
        inArray(
          translationv2.id,
          sizes.map((row) => row.id),
        ),
      )
      .limit(sizes.length + 1);
    const expected = new Map(sizes.map((row) => [row.id, row.size]));

    if (
      rows.length !== sizes.length ||
      new Set(rows.map((row) => row.id)).size !== rows.length ||
      rows.some((row) => expected.get(row.id) !== (row.contents?.length ?? 0))
    )
      throw new Error("Inconsistent mail translation snapshot");

    result.push(...rows.map((row) => ({ ...row, language })));
  }

  return result;
}
