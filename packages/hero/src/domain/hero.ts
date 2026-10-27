import type { HeroDefinition } from "../contracts/hero-definition.ts";
import { validateHeroDefinition } from "../validations/hero-definition.ts";

export abstract class Hero implements HeroDefinition {
  public abstract readonly identity: HeroDefinition["identity"];
  public abstract readonly name: string;
  public abstract readonly gender: HeroDefinition["gender"];
  public abstract readonly recruitment: HeroDefinition["recruitment"];
  public abstract readonly progression: HeroDefinition["progression"];
  public abstract readonly stars: HeroDefinition["stars"];
  public abstract readonly talentTrees: HeroDefinition["talentTrees"];
  public abstract readonly assignments: HeroDefinition["assignments"];
  public abstract readonly refinement: HeroDefinition["refinement"];

  public validate(): void {
    validateHeroDefinition(this);
  }
}
