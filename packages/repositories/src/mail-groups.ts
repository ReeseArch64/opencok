import type { createDatabases } from "@opencok/drizzle";
import type {
  MailCategorySnapshot,
  MailGroupInspector,
  MailGroupKey,
  MailGroupQuery,
} from "@opencok/contracts/mail";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { mail_contents } from "@opencok/drizzle/schema/opencok_kingdom/mail_contents";
import { mail_group } from "@opencok/drizzle/schema/opencok_kingdom/mail_group";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { and, asc, desc, eq, inArray, isNull, lt, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { readMailSenders, readMailTranslations } from "./mail-presentation.ts";

const selectedMail = alias(mail, "group_mail");

const key = (group: MailGroupKey) => JSON.stringify([group.groupType, group.groupIndex]);

const integer = (value: number) => Number.isInteger(value) && value >= 0 && value <= 2147483647;

const identifier = (value: string) =>
  typeof value === "string" && value.length <= 40 && !value.includes("\0") && value.isWellFormed();

export function readMailGroups(
  databases: ReturnType<typeof createDatabases>,
  kingdomId: number,
  uid: string,
  query: MailGroupQuery,
  inspect: MailGroupInspector,
): Promise<MailCategorySnapshot> {
  if (
    !identifier(uid) ||
    !uid.trim() ||
    !integer(kingdomId) ||
    kingdomId < 1 ||
    typeof query.moderation !== "boolean" ||
    !integer(query.begin) ||
    !integer(query.limit) ||
    !Number.isSafeInteger(query.now) ||
    query.now < 0 ||
    typeof inspect !== "function"
  )
    throw new Error("Invalid mail group query");

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

      const groups = query.limit
        ? await tx
            .select({
              uid: mail_group.uid,
              groupType: mail_group.groupType,
              groupIndex: mail_group.groupIndex,
              updateTime: mail_group.updateTime,
            })
            .from(mail_group)
            .where(
              and(
                eq(mail_group.uid, uid),
                query.moderation ? eq(mail_group.groupType, 500) : lt(mail_group.groupType, 500),
              ),
            )
            .orderBy(
              desc(mail_group.updateTime),
              asc(mail_group.groupType),
              asc(sql`${mail_group.groupIndex} collate "C"`),
            )
            .limit(Math.min(query.limit, 1001))
            .offset(query.begin)
            .for("update")
        : [];

      if (
        groups.length > Math.min(query.limit, 1000) ||
        new Set(groups.map(key)).size !== groups.length ||
        groups.some(
          (group, index) =>
            group.uid !== uid ||
            !Number.isInteger(group.groupType) ||
            group.groupType < -2147483648 ||
            group.groupType > 2147483647 ||
            (query.moderation ? group.groupType !== 500 : group.groupType >= 500) ||
            !identifier(group.groupIndex) ||
            typeof group.updateTime !== "bigint" ||
            (index > 0 && group.updateTime > groups[index - 1]!.updateTime),
        )
      )
        throw new Error("Invalid mail group window");

      const selected = new Map(groups.slice(0, 7).map((group) => [key(group), { ...group }]));
      const groupIndexes = new Set(groups.map((group) => group.groupIndex));
      const inspected = new Set<string>();
      const removableMail = new Set<string>();
      let bytes = 0;
      const cleanup = await inspect(groups, {
        senders: (ids) => {
          if (ids.some((id) => !groupIndexes.has(id)))
            throw new Error("Invalid mail group senders");

          return readMailSenders(databases, kingdomId, tx, ids);
        },
        translations: (requests) => readMailTranslations(tx, requests),
        preview: async (requested, selection) => {
          const groupKey = key(requested);
          const group = selected.get(groupKey);

          if (
            !group ||
            inspected.has(groupKey) ||
            !["sender", "type", "uid"].includes(selection.kind) ||
            !selection.types.length ||
            selection.types.length > 50 ||
            new Set(selection.types).size !== selection.types.length ||
            selection.types.some((type) => !integer(type) || type > 49) ||
            (selection.kind === "type" && selection.types.length !== 1)
          )
            throw new Error("Invalid mail group selection");

          inspected.add(groupKey);
          const predicate = and(
            eq(selectedMail.toUser, uid),
            inArray(selectedMail.type, [...selection.types]),
            selection.kind === "sender" ? eq(selectedMail.fromUser, group.groupIndex) : undefined,
            selection.kind === "uid" ? eq(selectedMail.uid, group.groupIndex) : undefined,
          );
          const counts = await tx
            .select({
              total: sql<string>`count(*)::text`,
              unread: sql<string>`(count(*) filter (where coalesce(${selectedMail.status}, 0) = 0))::text`,
            })
            .from(selectedMail)
            .where(predicate);

          if (
            counts.length !== 1 ||
            !/^(0|[1-9]\d*)$/.test(counts[0]!.total) ||
            !/^(0|[1-9]\d*)$/.test(counts[0]!.unread)
          )
            throw new Error("Invalid mail group counts");

          const total = BigInt(counts[0]!.total);
          const unread = BigInt(counts[0]!.unread);

          if (total > 2147483647n || unread > total || (selection.kind === "uid" && total > 1n))
            throw new Error("Mail group count capacity exceeded");

          if (!total) return { total, unread, entries: [] };

          const limit = Number(total < 7n ? total : 7n);
          const extraOwner = and(
            eq(mail_contents.uid, selectedMail.uid),
            or(
              eq(mail_contents.toUser, uid),
              eq(mail_contents.toUser, ""),
              isNull(mail_contents.toUser),
            ),
          );
          const order = [desc(selectedMail.createTime), asc(sql`${selectedMail.uid} collate "C"`)];
          const sizes = await tx
            .select({
              uid: selectedMail.uid,
              size: sql<number>`coalesce(octet_length(${selectedMail.contents}), 0) + coalesce(octet_length(${mail_contents.contents}), 0) + coalesce(octet_length(${selectedMail.rewardId}), 0)`,
            })
            .from(selectedMail)
            .leftJoin(mail_contents, extraOwner)
            .where(predicate)
            .orderBy(...order)
            .limit(limit)
            .for("update", { of: selectedMail });

          if (
            sizes.length !== limit ||
            new Set(sizes.map((row) => row.uid)).size !== sizes.length ||
            sizes.some(
              (row) =>
                !identifier(row.uid) || !row.uid || !Number.isSafeInteger(row.size) || row.size < 0,
            )
          )
            throw new Error("Invalid mail group metadata");

          bytes += sizes.reduce((sum, row) => sum + row.size, 0);

          if (bytes > 4 * 1024 * 1024) throw new Error("Mail group content capacity exceeded");

          const entries = await tx
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
                predicate,
                inArray(
                  selectedMail.uid,
                  sizes.map((row) => row.uid),
                ),
              ),
            )
            .orderBy(...order);

          if (
            entries.length !== sizes.length ||
            entries.some(
              (entry, index) =>
                entry.uid !== sizes[index]!.uid ||
                entry.toUser !== uid ||
                !selection.types.includes(entry.type) ||
                (selection.kind === "sender" && entry.fromUser !== group.groupIndex) ||
                (selection.kind === "uid" && entry.uid !== group.groupIndex) ||
                (entry.contents?.length ?? 0) +
                  (entry.extra?.length ?? 0) +
                  Buffer.byteLength(entry.rewardId ?? "") !==
                  sizes[index]!.size,
            )
          )
            throw new Error("Inconsistent mail group snapshot");

          const observedUnread = BigInt(
            entries.filter((entry) => (entry.status ?? 0) === 0).length,
          );

          if (observedUnread > unread || unread > total - BigInt(entries.length) + observedUnread)
            throw new Error("Inconsistent mail group counts");

          if (selection.kind === "uid") for (const entry of entries) removableMail.add(entry.uid);

          return { total, unread, entries };
        },
      });

      if (
        !cleanup ||
        !Array.isArray(cleanup.groups) ||
        !Array.isArray(cleanup.mailIds) ||
        new Set(cleanup.groups.map(key)).size !== cleanup.groups.length ||
        cleanup.groups.some((group) => !selected.has(key(group))) ||
        new Set(cleanup.mailIds).size !== cleanup.mailIds.length ||
        cleanup.mailIds.some((id) => !removableMail.has(id))
      )
        throw new Error("Invalid mail group removal plan");

      if (cleanup.mailIds.length)
        await tx.delete(mail).where(and(eq(mail.toUser, uid), inArray(mail.uid, cleanup.mailIds)));

      if (cleanup.groups.length)
        await tx
          .delete(mail_group)
          .where(
            and(
              eq(mail_group.uid, uid),
              or(
                ...cleanup.groups.map((group) =>
                  and(
                    eq(mail_group.groupType, group.groupType),
                    eq(mail_group.groupIndex, group.groupIndex),
                  ),
                ),
              ),
            ),
          );

      return { profile };
    },
    { isolationLevel: "repeatable read", accessMode: "read write" },
  );
}
