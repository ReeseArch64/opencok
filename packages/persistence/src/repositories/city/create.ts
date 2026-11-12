import type { City } from "../../models/kingdom/city";
import type { CreateCity } from "../../types/city";
import { CreateRepository } from "../../class/create-repository";

export class CreateCityRepository extends CreateRepository<City, CreateCity>
{}
