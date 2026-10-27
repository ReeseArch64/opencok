export type MarchPhase = "outbound" | "gathering" | "returning" | "completed";

export interface MarchTroops {
  armyId: string;
  quantity: number;
}

export interface MarchTroopBalance {
  armyId: string;
  free: number;
  march: number;
}

export interface MarchCargo {
  resource: "wood" | "stone" | "iron" | "food" | "silver" | "gold";
  amount: bigint;
}

export interface MarchLifecycle {
  purpose?: "trouble" | "treasure" | "scout";
  id: string;
  owner: string;
  worldId: number;
  origin: number;
  target: number;
  version: number;
  phase: MarchPhase;
  startedAt: bigint;
  dueAt: bigint;
  returnDuration: bigint;
  troops: readonly MarchTroops[];
  cargo: MarchCargo | null;
}

export interface MarchTransition {
  expectedVersion: number;
  march: MarchLifecycle;
  troops: readonly MarchTroopBalance[];
  credit: MarchCargo | null;
}
