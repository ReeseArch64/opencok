import type { createDatabases } from "@opencok/drizzle";
import type {
  MailCategoryInspector,
  MailCategoryQuery,
  MailCategorySnapshot,
} from "@opencok/contracts/mail";
import { readOwnedMailWindow } from "./mail-window.ts";

export function readMailCategory(
  databases: ReturnType<typeof createDatabases>,
  kingdomId: number,
  uid: string,
  query: MailCategoryQuery,
  inspect: MailCategoryInspector,
): Promise<MailCategorySnapshot> {
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
    ![query.category, query.begin, query.offset].every(
      (value) => Number.isInteger(value) && value >= -2147483648 && value <= 2147483647,
    ) ||
    typeof inspect !== "function"
  )
    {throw new Error("Invalid mail category query");}

  const limit =
    query.category < 1 || query.category > 8 || query.begin > 0
      ? 0
      : Math.max(0, (query.begin + query.offset) | 0);

  return readOwnedMailWindow(
    databases,
    kingdomId,
    uid,
    { begin: 0, limit, now: query.now },
    inspect,
  );
}
