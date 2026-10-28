import { varchar } from "drizzle-orm/pg-core";
import { opencok_pay } from "../namespaces";

export const goods = opencok_pay.table("goods", {
    "id": varchar("id", { length: 255 }),
    "name": varchar("name", { length: 255 }),
    "icon": varchar("icon", { length: 255 }),
    "description": varchar("description", { length: 255 }),
    "type": varchar("type", { length: 255 }),
    "type2": varchar("type2", { length: 255 }),
});
