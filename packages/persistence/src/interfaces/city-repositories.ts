import type { City } from "../models/kingdom/city";
import type { CreateCity } from "../types/city";
import type { PublishRepositories } from "./repository";

export interface CityRepositories extends PublishRepositories<City, CreateCity>
{
}
