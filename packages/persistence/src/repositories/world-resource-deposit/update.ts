import type { WorldResourceDeposit } from "../../models/kingdom/world-resource-deposit";
import type { UpdateWorldResourceDeposit } from "../../types/world-resource-deposit";
import { UpdateRepository } from "../../class/update-repository";

export class UpdateWorldResourceDepositRepository
    extends UpdateRepository<WorldResourceDeposit, UpdateWorldResourceDeposit>
{}
