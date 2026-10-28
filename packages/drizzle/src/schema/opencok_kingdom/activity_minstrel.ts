import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const activity_minstrel = opencok_kingdom.table(
    "activity_minstrel",
    {
        "uid": varchar("uid", { length: 32 }).notNull(),
        "type": integer("type").notNull().default(sql.raw("0")),
        "listen": integer("listen").notNull(),
        "listentime": bigint("listentime", { mode: "bigint" }),
        "share": integer("share"),
        "sharetime": bigint("sharetime", { mode: "bigint" }),
        "reward": integer("reward"),
        "rewardtime": bigint("rewardtime", { mode: "bigint" }),
        "resettime": bigint("resettime", { mode: "bigint" }),
    },
    (table) => [
        primaryKey({ name: "activity_minstrel_PRIMARY", columns: [table["uid"], table["type"]] }),
    ],
);
