import type { DragonDefinition } from "../contracts/dragon-definition.ts";
import { validateDragonDefinition } from "../validations/dragon-definition.ts";

export abstract class Dragon implements DragonDefinition
{
    public abstract readonly identity: DragonDefinition["identity"];
    public abstract readonly name: string;
    public abstract readonly server: DragonDefinition["server"];
    public abstract readonly hatchingSeconds: number;
    public abstract readonly renameGoldCost: number;
    public abstract readonly skillSlots: DragonDefinition["skillSlots"];
    public abstract readonly interactions: DragonDefinition["interactions"];
    public abstract readonly sustainedFeeding: DragonDefinition["sustainedFeeding"];
    public abstract readonly gifts: DragonDefinition["gifts"];
    public abstract readonly initialTalent: DragonDefinition["initialTalent"];
    public abstract readonly reputation: DragonDefinition["reputation"];

    public validate(): void
    {
        validateDragonDefinition(this);
    }
}
