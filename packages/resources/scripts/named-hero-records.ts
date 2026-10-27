import { heroCatalogBindings } from "@opencok/constants/hero-catalog-bindings";
import { HeroIdentity } from "@opencok/enums/hero-identity";
import { GameplayCatalog } from "@opencok/enums/gameplay-catalog";

export function namedHeroRecord(catalog: string, record: object) {
  if (
    catalog === GameplayCatalog.GeneralBase &&
    "id" in record &&
    record.id === heroCatalogBindings.heroes[HeroIdentity.Mulan].generalId
  ) {
    return {
      declaration: 'import { mulan } from "../../heroes/mulan.ts";',
      expression: "mulan",
    };
  }

  return undefined;
}
