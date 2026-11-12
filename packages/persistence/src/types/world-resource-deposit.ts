import type { z } from "zod";
import type {
    worldResourceDepositCreateValidator,
    worldResourceDepositUpdateValidator,
} from "../validators/world-resource-deposit";
export type CreateWorldResourceDeposit = z.input<typeof worldResourceDepositCreateValidator>;
export type UpdateWorldResourceDeposit = z.input<typeof worldResourceDepositUpdateValidator>;
