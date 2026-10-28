import { sql } from "drizzle-orm";
import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const s10_us1000 = opencok_global.table(
    "s10_us1000",
    {
        "uid": varchar("uid", { length: 40 }).notNull().default(sql.raw("''")),
    },
    (table) => [primaryKey({ name: "s10_us1000_PRIMARY", columns: [table["uid"]] })],
);
