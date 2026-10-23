import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const red_packets = opencok_kingdom.table("red_packets", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "range": integer("range").default(sql.raw("0")),
  "rangeId": varchar("rangeId", { length: 255 }).default(sql.raw("''")),
  "type": integer("type").default(sql.raw("0")),
  "sender": varchar("sender", { length: 255 }).default(sql.raw("''")),
  "senderName": varchar("senderName", { length: 255 }).default(sql.raw("''")),
  "pic": varchar("pic", { length: 40 }),
  "picVer": integer("picVer").default(sql.raw("0")),
  "total": integer("total").default(sql.raw("0")),
  "remain": integer("remain").default(sql.raw("0")),
  "sendTime": bigint("sendTime", { mode: "bigint" }).default(sql.raw("0")),
  "endTime": bigint("endTime", { mode: "bigint" }).default(sql.raw("0")),
  "totalPeople": integer("totalPeople").default(sql.raw("0")),
  "curPeople": integer("curPeople").default(sql.raw("0")),
  "state": integer("state").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "red_packets_PRIMARY", columns: [table["uid"]] }),
  index("red_packets_state_index").on(sql.raw("\"state\"")),
]);
