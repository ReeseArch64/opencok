import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const territory_trap_log = opencok_kingdom.table(
    "territory_trap_log",
    {
        "uuid": varchar("uuid", { length: 40 }).notNull().default(sql.raw("''")),
        "allianceid": varchar("allianceid", { length: 40 }).notNull(),
        "logid": integer("logid").notNull(),
        "param": varchar("param", { length: 100 }).notNull(),
        "createtime": bigint("createtime", { mode: "bigint" }).default(sql.raw("0")),
        "paramname": varchar("paramname", { length: 60 }).default(sql.raw("''")),
    },
    (table) => [
        primaryKey({ name: "territory_trap_log_PRIMARY", columns: [table["uuid"]] }),
        index("territory_trap_log_allianceid_index").on(sql.raw("\"allianceid\"")),
    ],
);
