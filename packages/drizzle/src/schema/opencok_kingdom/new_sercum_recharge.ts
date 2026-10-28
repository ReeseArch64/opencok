import { sql } from "drizzle-orm";
import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const new_sercum_recharge = opencok_kingdom.table(
    "new_sercum_recharge",
    {
        "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
        "id": varchar("id", { length: 255 }).notNull(),
    },
    (table) => [
        primaryKey({ name: "new_sercum_recharge_PRIMARY", columns: [table["uid"], table["id"]] }),
    ],
);
