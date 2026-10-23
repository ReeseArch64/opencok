import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const pray_record = cokdb1.table("pray_record", {
  "id": bigint("id", { mode: "bigint" }).notNull().generatedByDefaultAsIdentity({"name":"pray_record_id_seq","startWith":44571}),
  "uid": varchar("uid", { length: 255 }).notNull(),
  "cost": integer("cost").notNull().default(sql.raw("0")),
  "resource": varchar("resource", { length: 20 }).notNull(),
  "num": integer("num").notNull(),
  "hit": integer("hit").default(sql.raw("0")),
  "prayTime": bigint("prayTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "pray_record_PRIMARY", columns: [table["id"]] }),
  index("pray_record_uid_idx").on(sql.raw("\"uid\"")),
  index("pray_record_resource_idx").on(sql.raw("\"resource\"")),
  index("pray_record_time_idx").on(sql.raw("\"prayTime\"")),
]);
