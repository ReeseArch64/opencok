import { CosmeticOwnership } from "@opencok/skins/services/ownership";
import { CosmeticEventMapper } from "@opencok/skins/mappings/interaction";
import { CosmeticMapper } from "@opencok/skins/mappings/cosmetics";
import { CosmeticPolicy } from "@opencok/skins/rules/projection";
import type { Rules } from "@opencok/rules/game";
import type { CityProgressionContext } from "./city-progression-context";
import { text, num, long } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import { serverFeature } from "@opencok/rules/power-context";

export const { cosmeticOwnership, cosmeticTargetStates } = new CosmeticOwnership<
    Rules,
    CityProgressionContext
>({ text, num, long, cityInteger, serverFeature });

export const { cosmeticInteractionEvent } = new CosmeticEventMapper<Rules, CityProgressionContext>(
    { num, long },
    new CosmeticPolicy({ num, long, cityInteger }),
    new CosmeticMapper(),
    cosmeticTargetStates,
);
