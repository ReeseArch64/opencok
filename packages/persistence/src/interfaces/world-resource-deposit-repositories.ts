import type { WorldResourceDeposit } from "../models/kingdom/world-resource-deposit";
import type {
    CreateWorldResourceDeposit,
    UpdateWorldResourceDeposit,
} from "../types/world-resource-deposit";
import type { MutableRepositories } from "./repository";

export interface WorldResourceDepositRepositories extends
    MutableRepositories<
        WorldResourceDeposit,
        CreateWorldResourceDeposit,
        UpdateWorldResourceDeposit
    >
{}
