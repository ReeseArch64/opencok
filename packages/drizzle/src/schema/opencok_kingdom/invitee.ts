import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const invitee = opencok_kingdom.table(
    "invitee",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "inviterUid": varchar("inviterUid", { length: 40 }).notNull(),
        "status": integer("status"),
        "time": bigint("time", { mode: "bigint" }),
    },
    (table) => [primaryKey({ name: "invitee_PRIMARY", columns: [table["uid"]] })],
);
