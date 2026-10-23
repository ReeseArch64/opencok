import { primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const function_notice = opencok_kingdom.table(
  "function_notice",
  {
    "uid": varchar("uid", { length: 255 }).notNull(),
    "noticeMapStr": text("noticeMapStr"),
  },
  (table) => [primaryKey({ name: "function_notice_PRIMARY", columns: [table["uid"]] })],
);
