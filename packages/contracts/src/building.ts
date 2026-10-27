import type { ResourceType } from "@opencok/enums/resource";

export type BuildingResource = `${ResourceType}`;

export type BuildingCosts = Partial<Readonly<Record<BuildingResource, bigint>>>;

export interface BuildingRequirement {
  readonly buildingId: number;
  readonly level: number;
}

export interface BuildingItemCost {
  readonly itemId: number;
  readonly quantity?: bigint;
}

export interface BuildingStarRequirement {
  readonly levelId: number;
  readonly quantity: number;
}

export interface BuildingStep<T> {
  readonly progress: number;
  readonly value: T;
}

export interface BuildingEffects {
  readonly productionPerHour?: number;
  readonly productionCapacity?: number;
  readonly productionResourceId?: number;
  readonly protectedFood?: number;
  readonly reinforcementCapacity?: number;
  readonly rallyCapacity?: number;
  readonly woundedKnightCapacity?: number;
}

export interface BuildingClientParameter {
  readonly value: string;
  readonly steps?: readonly BuildingStep<string>[];
}

export interface BuildingUnlockCondition {
  readonly code: number;
  readonly value?: number;
}

export interface BuildingUnlockPayment {
  readonly paymentId: number;
  readonly amount: bigint;
}

export interface BuildingLevelDefinition {
  readonly id: number;
  readonly buildingId: number;
  readonly level: number;
  readonly starLevel: number;
  readonly costs?: BuildingCosts;
  readonly constructionSeconds?: number;
  readonly demolitionSeconds?: number;
  readonly experience?: number;
  readonly power?: number;
  readonly civilizationLevel?: number;
  readonly maxInstances?: number;
  readonly starEnabled?: boolean;
  readonly limit?: number;
  readonly requiredBuildings?: readonly BuildingRequirement[];
  readonly requiredItems?: readonly BuildingItemCost[];
  readonly effects?: BuildingEffects;
  readonly effectSteps?: Partial<
    Readonly<Record<keyof BuildingEffects, readonly BuildingStep<number>[]>>
  >;
  readonly clientParameters?: readonly (BuildingClientParameter | null)[];
  readonly unlockConditions?: readonly BuildingUnlockCondition[];
  readonly upgrades?: {
    readonly constructionSeconds?: readonly BuildingStep<number>[];
    readonly experience?: readonly BuildingStep<number>[];
    readonly power?: readonly BuildingStep<number>[];
    readonly costs?: readonly BuildingStep<BuildingCosts>[];
    readonly requiredItems?: readonly BuildingStep<readonly BuildingItemCost[]>[];
    readonly requiredBuildings?: readonly BuildingStep<readonly BuildingStarRequirement[]>[];
    readonly unlockConditions?: readonly BuildingStep<BuildingUnlockCondition>[];
    readonly unlockPayment?: readonly BuildingStep<BuildingUnlockPayment>[];
  };
}

export interface BuildingState extends BuildingLevelDefinition {
  readonly starProgress: number;
  readonly requiredStarBuildings?: readonly BuildingStarRequirement[];
  readonly unlockPayment?: BuildingUnlockPayment;
}

export interface BuildingDefinition {
  readonly id: number;
  readonly levelMax: number;
  readonly resourceId?: number;
  readonly levels: readonly BuildingLevelDefinition[];
}
