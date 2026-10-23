import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const alliance_task_record = opencok_kingdom.table("alliance_task_record", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "publishCount": integer("publishCount").default(sql.raw("0")),
  "refreshCount": integer("refreshCount").default(sql.raw("0")),
  "clearCount": integer("clearCount").default(sql.raw("0")),
  "itemRefreshCount": integer("itemRefreshCount").default(sql.raw("0")),
  "itemPublishCount": integer("itemPublishCount").default(sql.raw("0")),
  "itemPublishUseCount": integer("itemPublishUseCount").default(sql.raw("0")),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }).default(sql.raw("0")),
  "colorRate2": integer("colorRate2").default(sql.raw("0")),
  "colorRate3": integer("colorRate3").default(sql.raw("0")),
  "colorRate4": integer("colorRate4").default(sql.raw("0")),
  "colorRate5": integer("colorRate5").default(sql.raw("0")),
  "colorSysRate2": integer("colorSysRate2").default(sql.raw("0")),
  "colorSysRate3": integer("colorSysRate3").default(sql.raw("0")),
  "colorSysRate4": integer("colorSysRate4").default(sql.raw("0")),
  "colorSysRate5": integer("colorSysRate5").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "alliance_task_record_PRIMARY", columns: [table["uid"]] }),
]);
