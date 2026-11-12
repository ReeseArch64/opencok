import type { Kingdom } from "../../models/global/kingdom";
import type { CreateKingdom } from "../../types/kingdom";
import { CreateRepository } from "../../class/create-repository";

export class CreateKingdomRepository extends CreateRepository<Kingdom, CreateKingdom>
{}
