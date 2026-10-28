import { CommandDomain } from "@opencok/base/domain/command-domain";
import type { CityDomain } from "./city-domain.ts";

export abstract class CityCommandDomain extends CommandDomain implements CityDomain
{
    public abstract override readonly commands: CityDomain["commands"];
    public abstract readonly types: CityDomain["types"];
    public abstract readonly prepare: CityDomain["prepare"];
    public abstract readonly apply: CityDomain["apply"];
}
