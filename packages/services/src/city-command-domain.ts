import type { CityDomain } from "./city-domain.ts";

export abstract class CityCommandDomain implements CityDomain {
  public abstract readonly commands: CityDomain["commands"];
  public abstract readonly types: CityDomain["types"];
  public abstract readonly prepare: CityDomain["prepare"];
  public abstract readonly apply: CityDomain["apply"];

  public handles(command: string): boolean {
    return this.commands.includes(command);
  }
}
