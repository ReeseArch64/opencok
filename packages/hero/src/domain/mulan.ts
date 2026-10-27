import { Hero } from "./hero.ts";

export class Mulan extends Hero {
  public readonly name = "Hua Mulan";
  public readonly recruitment = {
    fragmentsRequired: 3000,
  } as const;
  public readonly progression = {
    initialLevel: 1,
    maximumLevel: 99,
    talentPointDivisor: 10,
  } as const;
}
