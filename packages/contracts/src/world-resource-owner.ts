import type { GeneralWorldSnapshot } from "@opencok/hero/contracts/general-world";
import type { PlayerEffectSnapshot } from "./power";
import type { Row } from "./rows";

export interface WorldResourceOwnerSnapshot
{
    effects: PlayerEffectSnapshot;
    buildings: readonly Row[];
    newGenerals: GeneralWorldSnapshot;
}
