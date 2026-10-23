import { primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const function_notice = cokdb1.table("function_notice", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "noticeMapStr": text("noticeMapStr"),
}, (table) => [
  primaryKey({ name: "function_notice_PRIMARY", columns: [table["uid"]] }),
]);
