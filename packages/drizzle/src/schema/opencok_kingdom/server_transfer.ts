import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const server_transfer = opencok_kingdom.table(
  "server_transfer",
  {
    "uid": varchar("uid", { length: 255 }).notNull(),
    "cdTime": bigint("cdTime", { mode: "bigint" }),
    "transferTime": bigint("transferTime", { mode: "bigint" }),
    "times": integer("times"),
    "beforeServers": varchar("beforeServers", { length: 255 }).default(sql.raw("''")),
  },
  (table) => [primaryKey({ name: "server_transfer_PRIMARY", columns: [table["uid"]] })],
);
