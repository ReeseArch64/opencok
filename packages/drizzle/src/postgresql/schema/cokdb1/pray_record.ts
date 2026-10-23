// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const pray_record = cokdb1.table("pray_record", {
  "id": bigint("id", { mode: "bigint" }).notNull().generatedByDefaultAsIdentity({ name: "pray_record_id_seq", startWith: 44571 }),
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "cost": integer("cost").notNull().default(sql.raw("0")),
  "resource": legacyText("resource", {"sqlType":"character varying(20)","collation":"C"}).notNull(),
  "num": integer("num").notNull(),
  "hit": integer("hit").default(sql.raw("0")),
  "prayTime": bigint("prayTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "pray_record_PRIMARY", columns: [table["id"]] }),
  index("pray_record_uid_idx").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\"")),
  index("pray_record_resource_idx").on(sql.raw("rtrim(\"resource\", ' ') COLLATE \"C\"")),
  index("pray_record_time_idx").on(sql.raw("\"prayTime\"")),
]);
