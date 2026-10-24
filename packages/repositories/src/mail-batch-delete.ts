import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { mail_contents } from "@opencok/drizzle/schema/opencok_kingdom/mail_contents";
import { mail_group } from "@opencok/drizzle/schema/opencok_kingdom/mail_group";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import type {
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

export function deleteMailCategories(
  db: RealmDatabase,
  kingdomId: number,
  owner: string,
  input: MailCategoryDeleteQuery,
  inspect: MailCategoryDeleteInspector,
): Promise<MailCategoryDeleteSnapshot> {
  identity(owner, kingdomId, input.now);
  if (!Array.isArray(input.labels) || input.labels.length > 1000 || typeof inspect !== "function")
    throw new Error("Invalid mailbox category deletion");
  const query = mailCategoryDeleteQuery(
    undefined,
    input.labels.map((label) => label.raw).join(","),
    input.now,
  );
  if (
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
