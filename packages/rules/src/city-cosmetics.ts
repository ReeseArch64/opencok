import { CosmeticPolicy } from "@opencok/skins/rules/projection";
import { num, long } from "@opencok/contracts/rows";
import { cityInteger } from "./city-progression";
import type { Rules } from "./game";

export const { cityCosmeticProjection } = new CosmeticPolicy<Rules>({ num, long, cityInteger });
