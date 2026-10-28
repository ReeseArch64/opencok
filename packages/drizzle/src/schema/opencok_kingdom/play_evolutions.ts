import { sql } from "drizzle-orm";
import { check, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const play_evolutions = opencok_kingdom.table(
    "play_evolutions",
    {
        "id": integer("id").notNull(),
        "hash": varchar("hash", { length: 255 }).notNull(),
        "applied_at": text("applied_at")
            .notNull()
            .default(
                sql.raw(
                    "to_char(statement_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS')",
                ),
            )
            .$onUpdateFn(() =>
                sql.raw(
                    "to_char(statement_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS')",
                )
            ),
        "apply_script": text("apply_script"),
        "revert_script": text("revert_script"),
        "state": varchar("state", { length: 255 }),
        "last_problem": text("last_problem"),
    },
    (table) => [
        primaryKey({ name: "play_evolutions_PRIMARY", columns: [table["id"]] }),
        check(
            "play_evolutions_applied_at_temporal",
            sql.raw(
                "(\"applied_at\" IS NULL OR (CASE WHEN \"applied_at\" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left(\"applied_at\",4) <> '0000' AND substring(\"applied_at\",6,2) <> '00' AND substring(\"applied_at\",9,2) <> '00' THEN to_char(to_date(left(\"applied_at\",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left(\"applied_at\",10) ELSE true END ELSE false END))",
            ),
        ),
    ],
);
