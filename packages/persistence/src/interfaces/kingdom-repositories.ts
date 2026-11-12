import type { Kingdom } from "../models/global/kingdom";
import type { CreateKingdom, UpdateKingdom } from "../types/kingdom";
import type { MutableRepositories } from "./repository";

export interface KingdomRepositories
    extends MutableRepositories<Kingdom, CreateKingdom, UpdateKingdom>
{}
