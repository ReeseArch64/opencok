import type { Kingdom } from "../../models/global/kingdom";
import type { UpdateKingdom } from "../../types/kingdom";
import { UpdateRepository } from "../../class/update-repository";

export class UpdateKingdomRepository extends UpdateRepository<Kingdom, UpdateKingdom>
{}
