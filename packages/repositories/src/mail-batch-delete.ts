import { enqueueMailChat } from "./mail-chat-intents.ts";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { mail_contents } from "@opencok/drizzle/schema/opencok_kingdom/mail_contents";
import { mail_group } from "@opencok/drizzle/schema/opencok_kingdom/mail_group";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { mail_update } from "@opencok/drizzle/schema/opencok_kingdom/mail_update";
import { alliance_invite_move } from "@opencok/drizzle/schema/opencok_kingdom/alliance_invite_move";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import type {
  MailBatchInvitationPlanner,
  MailCategoryDeleteInspector,
  MailCategoryDeleteQuery,
  MailCategoryDeleteSnapshot,
  MailTypeDeleteQuery,
} from "@opencok/contracts/mail";
import { mailCategoryDeleteQuery } from "@opencok/rules/mail-batch-delete";
import { and, eq, gt, gte, inArray, isNull, lt, lte, ne, or, sql, type SQL } from "drizzle-orm";
import type { Database } from "./game.ts";

type RealmDatabase = Database["kingdom"]["db"];
type Transaction = Parameters<Parameters<RealmDatabase["transaction"]>[0]>[0];

function identity(owner: string, kingdomId: number, now: number) {
  if (
    typeof owner !== "string" ||
    !owner.trim() ||
    owner.length > 40 ||
    owner.includes("\0") ||
    !owner.isWellFormed() ||
    !Number.isInteger(kingdomId) ||
    kingdomId < 1 ||
    kingdomId > 2147483647 ||
    !Number.isSafeInteger(now) ||
    now < 0
  )
    throw new Error("Invalid mailbox deletion owner");
}

async function owned(tx: Transaction, owner: string, kingdomId: number, now: number) {
  const [profile] = await tx
    .select({
      uid: userprofile.uid,
      serverId: userprofile.serverId,
      banTime: userprofile.banTime,
      banFlag: userprofile.banFlag,
    })
    .from(userprofile)
    .where(eq(userprofile.uid, owner))
    .limit(1)
    .for("update");
  const authorized =
    !!profile &&
    profile.uid === owner &&
    profile.serverId === kingdomId &&
    (profile.banFlag ?? 0) === 0 &&
    (profile.banTime ?? 0n) <= BigInt(now);
  return { profile, authorized };
}

function categoryKey(category: number): number {
  return category >= 0 && category <= 5 ? category : 6;
}

function categoryPredicate(category: number): SQL {
  switch (category) {
    case 0:
      return or(lt(mail.type, 13), gt(mail.type, 16))!;
    case 1:
      return and(gte(mail.type, 14), lte(mail.type, 16))!;
    case 2:
      return eq(mail.type, 13);
    case 3:
      return inArray(mail.type, [6, 7, 8, 9, 30]);
    case 4:
      return and(gt(mail.type, 22), lt(mail.type, 25))!;
    case 5:
      return eq(mail.type, 32);
    default:
      return and(gte(mail.type, 13), lte(mail.type, 16))!;
  }
}

async function deleteExplicit(
  tx: Transaction,
  owner: string,
  query: MailCategoryDeleteQuery,
  invitations: MailBatchInvitationPlanner | undefined,
  chatEnabled: boolean,
) {
  if (!query.ids?.length) return;
  if (typeof invitations !== "function") throw new Error("Missing invitation deletion planner");
  const ids = [...query.ids];
  const extraOwner = or(
    eq(mail_contents.toUser, owner),
    eq(mail_contents.toUser, ""),
    isNull(mail_contents.toUser),
  );
  const selection = and(eq(mail.toUser, owner), inArray(mail.uid, ids));
  const selected = await tx
    .select({
      uid: mail.uid,
      type: mail.type,
      rewardStatus: mail.rewardStatus,
      fromUser: mail.fromUser,
      inlineBytes: sql<number>`case when ${mail.type} = 26 then octet_length(${mail.contents}) else 0 end`,
      extraBytes: sql<number>`case when ${mail.type} = 26 then coalesce(octet_length(${mail_contents.contents}), 0) else 0 end`,
    })
    .from(mail)
    .leftJoin(mail_contents, and(eq(mail_contents.uid, mail.uid), extraOwner))
    .where(selection);
  if (
    selected.length > ids.length ||
    selected.some(
      (entry) =>
        ![entry.inlineBytes, entry.extraBytes].every(
          (size) => Number.isSafeInteger(size) && size >= 0,
        ),
    ) ||
    selected.reduce((size, entry) => size + entry.inlineBytes + entry.extraBytes, 0) >
      8 * 1024 * 1024
  )
    throw new Error("Mailbox deletion contents exceed limit");
  const affected = selected.filter((entry) => entry.rewardStatus !== 0);
  const chatTypes = new Set([20, 21, 22, 23, 24, 37, 38, 39, 40, 45, 46]);
  const chats = affected.filter((entry) => chatTypes.has(entry.type));
  if (chats.length) {
    if (!chatEnabled) throw new GameError(errors.unsupported, "mail");
    const moderator = chats.some((entry) => [23, 24, 39, 40].includes(entry.type));
    const personal = chats.some((entry) => ![23, 24, 39, 40].includes(entry.type));
    const types = moderator && personal ? [1, 2, 20] : moderator ? [2] : [1, 20];
    const senders = [
      ...new Set(chats.map((entry) => (entry.fromUser === null ? "null" : entry.fromUser))),
    ];
    await enqueueMailChat(
      tx,
      owner,
      query.now,
      senders.map((others) => ({ action: "delete", others, types })),
    );
    const selections = new Map(
      chats
        .filter((entry) => [20, 21, 22, 23, 24, 39, 40].includes(entry.type))
        .map((entry) => [
          JSON.stringify([entry.fromUser, [23, 24, 39, 40].includes(entry.type)]),
          entry,
        ]),
    );
    for (const entry of selections.values()) {
      const types = [23, 24, 39, 40].includes(entry.type) ? [23, 24] : [20, 21, 22];
      await tx
        .delete(mail)
        .where(
          and(
            eq(mail.toUser, owner),
            entry.fromUser === null
              ? sql`${mail.fromUser} = ${null}`
              : eq(mail.fromUser, entry.fromUser),
            inArray(mail.type, types),
          ),
        );
    }
  }
  const invitationIds = affected.filter((entry) => entry.type === 26).map((entry) => entry.uid);
  const invitationEntries = invitationIds.length
    ? await tx
        .select({
          uid: mail.uid,
          type: mail.type,
          fromUser: mail.fromUser,
          contents: mail.contents,
          extra: mail_contents.contents,
        })
        .from(mail)
        .leftJoin(mail_contents, and(eq(mail_contents.uid, mail.uid), extraOwner))
        .where(and(eq(mail.toUser, owner), inArray(mail.uid, invitationIds)))
    : [];
  if (invitationEntries.length !== invitationIds.length)
    throw new Error("Mailbox selection changed during deletion");
  const repairs = invitations(invitationEntries);
  if (
    repairs.length > invitationEntries.length ||
    new Set(repairs.map((repair) => repair.uid)).size !== repairs.length ||
    repairs.some(
      (repair) =>
        !invitationIds.includes(repair.uid) ||
        typeof repair.inviter !== "string" ||
        repair.inviter.length > 255 ||
        repair.inviter.includes("\0") ||
        !repair.inviter.isWellFormed() ||
        !Buffer.isBuffer(repair.contents) ||
        repair.contents.byteLength > 65535,
    )
  )
    throw new Error("Invalid invitation deletion plan");
  await tx.delete(mail).where(and(selection, eq(mail.saveFlag, 0), ne(mail.rewardStatus, 0)));
  const ownedIds = selected.map((entry) => entry.uid);
  if (ownedIds.length)
    await tx.delete(mail_contents).where(and(inArray(mail_contents.uid, ownedIds), extraOwner));
  await tx
    .insert(mail_update)
    .values(ids.map((mailUid) => ({ toUser: owner, mailUid, updateTime: BigInt(query.now) })))
    .onConflictDoUpdate({
      target: [mail_update.toUser, mail_update.mailUid],
      set: { updateTime: sql`greatest(${mail_update.updateTime}, excluded."updateTime")` },
    });
  const expandedTypes = [...new Set(affected.map((entry) => entry.type))].filter(
    (type) => type === 5 || type === 10 || type === 18,
  );
  if (expandedTypes.length)
    await tx
      .delete(mail)
      .where(
        and(eq(mail.toUser, owner), inArray(mail.type, expandedTypes), ne(mail.rewardStatus, 0)),
      );
  const grouped = new Set([
    2, 5, 10, 11, 12, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 33, 34, 39, 40,
  ]);
  const pointers = affected.filter((entry) => grouped.has(entry.type));
  for (let offset = 0; offset < pointers.length; offset += 200)
    await tx
      .delete(mail_group)
      .where(
        and(
          eq(mail_group.uid, owner),
          or(
            ...pointers
              .slice(offset, offset + 200)
              .map((entry) =>
                and(eq(mail_group.groupType, entry.type), eq(mail_group.groupIndex, entry.uid)),
              ),
          ),
        ),
      );
  for (const repair of repairs)
    await tx
      .update(mail)
      .set({ contents: repair.contents })
      .where(and(eq(mail.toUser, owner), eq(mail.uid, repair.uid), eq(mail.type, 26)));
  const inviters = [...new Set(repairs.map((repair) => repair.inviter))];
  if (inviters.length)
    await tx
      .delete(alliance_invite_move)
      .where(
        and(
          eq(alliance_invite_move.invitee, owner),
          inArray(alliance_invite_move.inviter, inviters),
        ),
      );
}

export function deleteMailCategories(
  db: RealmDatabase,
  kingdomId: number,
  owner: string,
  input: MailCategoryDeleteQuery,
  inspect: MailCategoryDeleteInspector,
  invitations?: MailBatchInvitationPlanner,
  chatEnabled = false,
): Promise<MailCategoryDeleteSnapshot> {
  identity(owner, kingdomId, input.now);
  if (
    !Array.isArray(input.labels) ||
    input.labels.length > 1000 ||
    typeof inspect !== "function" ||
    (input.ids !== undefined &&
      (!Array.isArray(input.ids) ||
        input.ids.length > 1000 ||
        input.ids.some((id) => typeof id !== "string" || !id.length || id.includes(","))))
  )
    throw new Error("Invalid mailbox category deletion");
  const query = mailCategoryDeleteQuery(
    input.ids?.join(","),
    input.labels.map((label) => label.raw).join(","),
    input.now,
  );
  if (
    (input.ids !== undefined &&
      ((query.ids ?? []).length !== input.ids.length ||
        (query.ids ?? []).some((id, index) => id !== input.ids![index]))) ||
    query.labels.length !== input.labels.length ||
    query.labels.some(
      (label, index) =>
        label.raw !== input.labels[index]!.raw || label.category !== input.labels[index]!.category,
    )
  )
    throw new Error("Invalid mailbox category deletion");
  return db.transaction(
    async (tx) => {
      const { profile, authorized } = await owned(tx, owner, kingdomId, query.now);
      if (!authorized) return { profile };
      await deleteExplicit(tx, owner, query, invitations, chatEnabled);
      const counts = new Map<number, { total: number; unread: number }>();
      for (const key of new Set(query.labels.map((label) => categoryKey(label.category)))) {
        const [row] = await tx
          .select({
            total: sql<string>`count(*) filter (where ${mail.rewardStatus} = 0)::text`,
            unread: sql<string>`count(*) filter (where ${mail.rewardStatus} = 0 and coalesce(${mail.status}, 0) = 0)::text`,
          })
          .from(mail)
          .where(and(eq(mail.toUser, owner), categoryPredicate(key)));
        if (
          !row ||
          !/^(0|[1-9]\d*)$/.test(row.total) ||
          !/^(0|[1-9]\d*)$/.test(row.unread) ||
          BigInt(row.unread) > BigInt(row.total)
        )
          throw new Error("Invalid mailbox category counts");
        counts.set(key, {
          total: Number(BigInt.asIntN(32, BigInt(row.total))),
          unread: Number(BigInt.asIntN(32, BigInt(row.unread))),
        });
      }
      inspect(
        query.labels.map((label) => ({
          raw: label.raw,
          ...counts.get(categoryKey(label.category))!,
        })),
      );
      if (!counts.size) return { profile };
      const selection = and(
        eq(mail.toUser, owner),
        or(...[...counts.keys()].map(categoryPredicate)),
      );
      const selectedIds = tx.select({ uid: mail.uid }).from(mail).where(selection);
      await tx
        .delete(mail_contents)
        .where(
          and(
            inArray(mail_contents.uid, selectedIds),
            or(
              eq(mail_contents.toUser, owner),
              eq(mail_contents.toUser, ""),
              isNull(mail_contents.toUser),
            ),
          ),
        );
      await tx.delete(mail).where(and(selection, eq(mail.saveFlag, 0), ne(mail.rewardStatus, 0)));
      return { profile };
    },
    { isolationLevel: "read committed", accessMode: "read write" },
  );
}

export function deleteMailType(
  db: RealmDatabase,
  kingdomId: number,
  owner: string,
  input: MailTypeDeleteQuery,
): Promise<MailCategoryDeleteSnapshot> {
  identity(owner, kingdomId, input.now);
  const query = { ...input };
  if (
    query.type !== undefined &&
    (!Number.isInteger(query.type) || query.type < -2147483648 || query.type > 2147483647)
  )
    throw new Error("Invalid mailbox deletion type");
  return db.transaction(
    async (tx) => {
      const { profile, authorized } = await owned(tx, owner, kingdomId, query.now);
      if (!authorized || query.type === undefined) return { profile };
      await tx
        .delete(mail)
        .where(and(eq(mail.toUser, owner), eq(mail.type, query.type), ne(mail.rewardStatus, 0)));
      const group =
        query.type === 5 ? 200 : query.type === 10 ? 400 : query.type === 18 ? 300 : undefined;
      if (group !== undefined)
        await tx
          .delete(mail_group)
          .where(
            and(
              eq(mail_group.uid, owner),
              eq(mail_group.groupType, group),
              eq(mail_group.groupIndex, ""),
            ),
          );
      return { profile };
    },
    { isolationLevel: "read committed", accessMode: "read write" },
  );
}
