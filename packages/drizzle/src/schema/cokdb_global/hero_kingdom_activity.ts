import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";

export const hero_kingdom_activity = cokdb_global.table("hero_kingdom_activity", {
  "uuid": integer("uuid").notNull().generatedByDefaultAsIdentity({"name":"hero_kingdom_activity_uuid_seq","startWith":9000003}),
  "sid": integer("sid"),
  "delay": varchar("delay", { length: 255 }),
  "power": varchar("power", { length: 255 }),
}, (table) => [
  primaryKey({ name: "hero_kingdom_activity_PRIMARY", columns: [table["uuid"]] }),
]);
