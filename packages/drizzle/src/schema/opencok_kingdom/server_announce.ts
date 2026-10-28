import { sql } from "drizzle-orm";
import { bigint, check, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const server_announce = opencok_kingdom.table(
    "server_announce",
    {
        "serverId": varchar("serverId", { length: 255 }).notNull(),
        "randomGeneral": bytea("randomGeneral"),
        "lastMoniterPushTime": bigint("lastMoniterPushTime", { mode: "bigint" }),
    },
    (table) => [
        primaryKey({ name: "server_announce_PRIMARY", columns: [table["serverId"]] }),
        check(
            "server_announce_randomGeneral_length",
            sql.raw("octet_length(\"randomGeneral\") <= 65535"),
        ),
    ],
);
