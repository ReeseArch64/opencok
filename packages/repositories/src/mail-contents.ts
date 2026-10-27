import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { mail_contents } from "@opencok/drizzle/schema/opencok_kingdom/mail_contents";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { alias } from "drizzle-orm/pg-core";
import { and, asc, eq, inArray, isNull, or, sql } from "drizzle-orm";
import type {
  MailContentsInspector,
  MailContentsQuery,
  MailContentsSnapshot,
} from "@opencok/contracts/mail";
import type { Database } from "./game.ts";

const selectedMail = alias(mail, "selected_mail");

export function readMailContents(
  db: Database["kingdom"]["db"],
  kingdomId: number,
  uid: string,
  query: MailContentsQuery,
  inspect: MailContentsInspector,
): Promise<MailContentsSnapshot> {
  if (
    !uid.trim() ||
    uid.length > 40 ||
    uid.includes("\0") ||
    !uid.isWellFormed() ||
    !Number.isInteger(kingdomId) ||
    kingdomId < 1 ||
    kingdomId > 2147483647 ||
    !Number.isSafeInteger(query.now) ||
    query.now < 0 ||
    !query.ids.length ||
    query.ids.length > 1000 ||
    new Set(query.ids).size !== query.ids.length ||
    query.ids.some(
      (id) =>
        typeof id !== "string" ||
        !id.length ||
        id.length > 40 ||
        id.includes("\0") ||
        !id.isWellFormed(),
    ) ||
    typeof inspect !== "function"
  )
    {throw new Error("Invalid mail content query");}

  return db.transaction(
    async (tx) => {
      const profile = (
        await tx
          .select({
            uid: userprofile.uid,
            serverId: userprofile.serverId,
            banTime: userprofile.banTime,
            banFlag: userprofile.banFlag,
          })
          .from(userprofile)
          .where(eq(userprofile.uid, uid))
          .limit(1)
          .for("update")
      )[0];

      if (
        !profile ||
        profile.uid !== uid ||
        profile.serverId !== kingdomId ||
        (profile.banFlag ?? 0) !== 0 ||
        (profile.banTime ?? 0n) > BigInt(query.now)
      )
        {return { profile };}

      const selection = and(eq(selectedMail.toUser, uid), inArray(selectedMail.uid, query.ids));
      const extraOwner = and(
        eq(mail_contents.uid, selectedMail.uid),
        or(
          eq(mail_contents.toUser, uid),
          eq(mail_contents.toUser, ""),
          isNull(mail_contents.toUser),
        ),
      );
      const sizes = await tx
        .select({
          uid: selectedMail.uid,
          size: sql<number>`coalesce(octet_length(${selectedMail.contents}), 0) + coalesce(octet_length(${mail_contents.contents}), 0)`,
        })
        .from(selectedMail)
        .leftJoin(mail_contents, extraOwner)
        .where(selection)
        .orderBy(asc(sql`${selectedMail.uid} collate "C"`))
        .for("update", { of: selectedMail });

      if (
        sizes.length > query.ids.length ||
        sizes.some((row) => !Number.isSafeInteger(row.size) || row.size < 0) ||
        sizes.reduce((sum, row) => sum + row.size, 0) > 4 * 1024 * 1024
      )
        {throw new Error("Mail content capacity exceeded");}

      const entries = sizes.length
        ? await tx
            .select({
              uid: selectedMail.uid,
              type: selectedMail.type,
              createTime: selectedMail.createTime,
              contents: selectedMail.contents,
              extra: mail_contents.contents,
            })
            .from(selectedMail)
            .leftJoin(mail_contents, extraOwner)
            .where(selection)
            .orderBy(asc(sql`${selectedMail.uid} collate "C"`))
        : [];

      if (
        entries.length !== sizes.length ||
        entries.some((entry, index) => entry.uid !== sizes[index]?.uid) ||
        entries.reduce(
          (sum, row) => sum + (row.contents?.length ?? 0) + (row.extra?.length ?? 0),
          0,
        ) >
          4 * 1024 * 1024
      )
        {throw new Error("Inconsistent mail content snapshot");}

      const invalid = inspect(entries);
      const selected = new Set(entries.map((row) => row.uid));

      if (
        !Array.isArray(invalid) ||
        new Set(invalid).size !== invalid.length ||
        invalid.some((id) => !selected.has(id))
      )
        {throw new Error("Invalid mail content removal plan");}

      if (invalid.length)
        {await tx.delete(mail).where(and(eq(mail.toUser, uid), inArray(mail.uid, invalid)));}

      return { profile };
    },
    { isolationLevel: "repeatable read", accessMode: "read write" },
  );
}
