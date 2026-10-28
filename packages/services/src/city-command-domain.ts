import { ActivityDomain } from "@opencok/base/domain/activity-domain";
import type { CityProgressionContext } from "./city-progression-context";

export abstract class CityCommandDomain extends ActivityDomain<CityProgressionContext>
{}
