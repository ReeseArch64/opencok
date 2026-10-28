import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { AddUserEquipDefinition } from "../types/add_user_equip.ts";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./add_user_equip.records0.ts";

export const catalog: CatalogTable<AddUserEquipDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [{ "id": "add_user_equip", "start": 0, "count": 13 }],
};
