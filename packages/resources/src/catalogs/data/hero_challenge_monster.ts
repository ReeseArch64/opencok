import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { HeroChallengeMonsterDefinition } from "@opencok/hero/resources/catalogs/types/hero_challenge_monster";
import type { CatalogTable } from "../../catalog-model.ts";
import { records as records0 } from "./hero_challenge_monster.records0.ts";

export const catalog: CatalogTable<HeroChallengeMonsterDefinition> = {
    "kind": CatalogKind.Table,
    "records": [...records0],
    "sections": [],
};
