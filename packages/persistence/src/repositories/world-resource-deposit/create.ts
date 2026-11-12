import type { WorldResourceDeposit } from "../../models/kingdom/world-resource-deposit";
import type { CreateWorldResourceDeposit } from "../../types/world-resource-deposit";
import { CreateRepository } from "../../class/create-repository";

export class CreateWorldResourceDepositRepository
    extends CreateRepository<WorldResourceDeposit, CreateWorldResourceDeposit>
{}
