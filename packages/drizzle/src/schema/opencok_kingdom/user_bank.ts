import { sql } from "drizzle-orm";
import { integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_bank = opencok_kingdom.table(
    "user_bank",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "level": integer("level").notNull().default(sql.raw("0")),
        "deposit": text("deposit"),
    },
    (table) => [primaryKey({ name: "user_bank_PRIMARY", columns: [table["uid"]] })],
);
