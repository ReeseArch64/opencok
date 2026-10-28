import type { InventoryTransaction } from "@opencok/economy/repositories/inventory-transaction";
import type { ProgressionBoundary } from "@opencok/contracts/progression-boundary";
import type { CityProgressionStore } from "@opencok/contracts/city-progression";

export type CityTransaction = InventoryTransaction;
export type CityProductionBoundary = ProgressionBoundary<CityTransaction>;
export type CityBirthAllocator = NonNullable<CityProgressionStore["birthPoint"]>;
