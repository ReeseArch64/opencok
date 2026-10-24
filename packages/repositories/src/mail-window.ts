import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { mail_contents } from "@opencok/drizzle/schema/opencok_kingdom/mail_contents";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { alias } from "drizzle-orm/pg-core";
import { and, asc, desc, eq, inArray, isNull, or, sql } from "drizzle-orm";
import type { createDatabases } from "@opencok/drizzle";
import type { MailCategoryInspector, MailCategorySnapshot } from "@opencok/contracts/mail";
import { readMailSenders, readMailTranslations } from "./mail-presentation.ts";

const selectedMail = alias(mail, "selected_mail");

export function readOwnedMailWindow(
  databases: ReturnType<typeof createDatabases>,
  kingdomId: number,
  uid: string,
  query: {
    begin: number;
    limit: number;
    now: number;
    types?: readonly number[];
    fromUser?: string;
  },
  inspect: MailCategoryInspector,
): Promise<MailCategorySnapshot> {
  const { limit } = query;
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
    ![query.begin, query.limit].every(
      (value) => Number.isInteger(value) && value >= 0 && value <= 2147483647,
    ) ||
    typeof inspect !== "function"
  )
    throw new Error("Invalid mail window query");
  return databases.getKingdom(kingdomId).db.transaction(
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
        return { profile };
      const extraOwner = and(
        eq(mail_contents.uid, selectedMail.uid),
        or(
          eq(mail_contents.toUser, uid),
          eq(mail_contents.toUser, ""),
          isNull(mail_contents.toUser),
        ),
      );
      const order = [desc(selectedMail.createTime), asc(sql`${selectedMail.uid} collate "C"`)];
      const selection = and(
        eq(selectedMail.toUser, uid),
        query.types ? inArray(selectedMail.type, [...query.types]) : undefined,
        query.fromUser !== undefined ? eq(selectedMail.fromUser, query.fromUser) : undefined,
      );
      const sizes = limit
        ? await tx
            .select({
              uid: selectedMail.uid,
              size: sql<number>`coalesce(octet_length(${selectedMail.contents}), 0) + coalesce(octet_length(${mail_contents.contents}), 0) + coalesce(octet_length(${selectedMail.rewardId}), 0)`,
            })
            .from(selectedMail)
            .leftJoin(mail_contents, extraOwner)
            .where(selection)
            .orderBy(...order)
            .limit(Math.min(limit, 1001))
            .offset(query.begin)
            .for("update", { of: selectedMail })
        : [];
      if (
        sizes.length > Math.min(limit, 1000) ||
        new Set(sizes.map((row) => row.uid)).size !== sizes.length ||
        sizes.some((row) => !Number.isSafeInteger(row.size) || row.size < 0) ||
        sizes.reduce((total, row) => total + row.size, 0) > 4 * 1024 * 1024
      )
        throw new Error("Mail list capacity exceeded");
      const entries = sizes.length
        ? await tx
            .select({
              uid: selectedMail.uid,
              toUser: selectedMail.toUser,
              fromUser: selectedMail.fromUser,
              fromName: selectedMail.fromName,
              title: selectedMail.title,
              rewardId: selectedMail.rewardId,
              rewardStatus: selectedMail.rewardStatus,
              status: selectedMail.status,
              itemIdFlag: selectedMail.itemIdFlag,
              saveFlag: selectedMail.saveFlag,
              reply: selectedMail.reply,
              translationId: selectedMail.translationId,
              type: selectedMail.type,
              createTime: selectedMail.createTime,
              contents: selectedMail.contents,
              extra: mail_contents.contents,
            })
            .from(selectedMail)
            .leftJoin(mail_contents, extraOwner)
            .where(
              and(
                eq(selectedMail.toUser, uid),
                inArray(
                  selectedMail.uid,
                  sizes.map((row) => row.uid),
                ),
              ),
            )
            .orderBy(...order)
        : [];
      if (
        entries.length !== sizes.length ||
        entries.some(
          (row, index) =>
            row.uid !== sizes[index]?.uid ||
            row.toUser !== uid ||
            (row.contents?.length ?? 0) +
              (row.extra?.length ?? 0) +
              Buffer.byteLength(row.rewardId ?? "") !==
              sizes[index]?.size,
        )
      )
        throw new Error("Inconsistent mail list snapshot");
      const invalid = await inspect(entries, {
        senders: (uids) => readMailSenders(databases, kingdomId, tx, uids),
        translations: (requests) => readMailTranslations(tx, requests),
      });
      const selected = new Set(entries.map((row) => row.uid));
      if (
        !Array.isArray(invalid) ||
        new Set(invalid).size !== invalid.length ||
        invalid.some((id) => !selected.has(id))
      )
        throw new Error("Invalid mail list removal plan");
      if (invalid.length)
        await tx.delete(mail).where(and(eq(mail.toUser, uid), inArray(mail.uid, invalid)));
      return { profile };
    },
    { isolationLevel: "repeatable read", accessMode: "read write" },
  );
}
