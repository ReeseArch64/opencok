import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_cemetery = opencok_kingdom.table(
    "user_cemetery",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "deadSum": bigint("deadSum", { mode: "bigint" }).default(sql.raw("0")),
        "deadAbilityValue": bigint("deadAbilityValue", { mode: "bigint" }).default(sql.raw("0")),
        "contributionValue": integer("contributionValue").notNull().default(sql.raw("0")),
        "needContributionValue": integer("needContributionValue").notNull().default(sql.raw("0")),
        "contributionStage": integer("contributionStage").notNull().default(sql.raw("0")),
        "useItemSum": integer("useItemSum").notNull().default(sql.raw("0")),
        "pubDeadInfo": varchar("pubDeadInfo", { length: 1500 }).notNull(),
        "priDeadInfo": varchar("priDeadInfo", { length: 1500 }).notNull(),
        "reviveAbilityValue": bigint("reviveAbilityValue", { mode: "bigint" }).default(
            sql.raw("0"),
        ),
        "tempReviveInfo": varchar("tempReviveInfo", { length: 1500 }),
        "isPriInfoEmpty": integer("isPriInfoEmpty").default(sql.raw("0")),
        "reviveSumThisTime": integer("reviveSumThisTime").default(sql.raw("0")),
        "freedata": varchar("freedata", { length: 1500 }),
        "revived": text("revived"),
    },
    (table) => [primaryKey({ name: "user_cemetery_PRIMARY", columns: [table["uid"]] })],
);
