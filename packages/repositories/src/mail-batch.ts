import type { createDatabases } from "@opencok/drizzle";
import type {
  MailBatchKind,
  MailBatchQuery,
  MailCategoryInspector,
  MailCategorySnapshot,
} from "@opencok/contracts/mail";
import { readOwnedMailWindow } from "./mail-window.ts";

const types = new Map<MailBatchKind, readonly number[]>([
  ["notices", [14, 15, 16]],
  ["studio", [13]],
  ["personal", [20, 21, 22]],
  ["resources", [5]],
  ["fight", [6, 7, 8, 9]],
  ["monsters", [18]],
  ["trade", [10]],
  ["moderation", [23, 24]],
  ["boss", [32]],
  ["empty", []],
]);

export function readMailBatch(
  databases: ReturnType<typeof createDatabases>,
  kingdomId: number,
  uid: string,
  query: MailBatchQuery,
  inspect: MailCategoryInspector,
): Promise<MailCategorySnapshot> {
  const selected = types.get(query.kind);
  const sender = query.kind === "personal" || query.kind === "moderation";

  if (
    !selected ||
    (query.kind === "empty" && (query.begin !== 0 || query.limit !== 0)) ||
    (sender
      ? typeof query.fromUser !== "string" ||
        !query.fromUser.length ||
        query.fromUser.length > 40 ||
        query.fromUser.includes("\0") ||
        !query.fromUser.isWellFormed()
      : query.fromUser !== null)
  )
    throw new Error("Invalid mail batch query");

  return readOwnedMailWindow(
    databases,
    kingdomId,
    uid,
    {
      begin: query.begin,
      limit: query.limit,
      now: query.now,
      types: selected,
      ...(sender ? { fromUser: query.fromUser! } : {}),
    },
    inspect,
  );
}
