import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const alliance_gift = opencok_kingdom.table(
    "alliance_gift",
    {
        "uid": varchar("uid", { length: 40 }).notNull().default(sql.raw("''")),
        "allianceid": varchar("allianceid", { length: 40 }).notNull(),
        "level": integer("level"),
        "typeId": integer("typeId").notNull(),
        "time": bigint("time", { mode: "bigint" }),
        "expiretime": integer("expiretime"),
    },
    (table) => [primaryKey({ name: "alliance_gift_PRIMARY", columns: [table["uid"]] })],
);
