import { buildingStep } from "@opencok/rules/building";
import type { BuildingState } from "@opencok/contracts/building";

export function buildingDisplayParameters(state: BuildingState): (string | undefined)[] {
  const parameters = Array.from({ length: 6 }, (_, index) => {
    const parameter = state.clientParameters?.[index];
    if (!parameter) return undefined;
    return state.level === 30 && (parameter.steps?.length ?? 0) > 1
      ? (buildingStep(parameter.steps, state.starProgress)?.value ?? parameter.value)
      : parameter.value;
  });
  const effect = (index: number, value: number | undefined) => {
    if (value !== undefined) parameters[index] = String(value);
  };
  if (state.effects?.productionResourceId !== undefined) {
    effect(0, state.effects.productionPerHour);
    effect(1, state.effects.productionCapacity);
  }
  if (state.buildingId === 404000) effect(3, state.effects?.protectedFood);
  if (state.buildingId === 427000) effect(0, state.effects?.reinforcementCapacity);
  if (state.buildingId === 407000) effect(0, state.effects?.rallyCapacity);
  if (state.buildingId === 441000) effect(0, state.effects?.woundedKnightCapacity);
  return parameters;
}

export function buildingRequirements(state: BuildingState): string {
  return (
    state.requiredBuildings?.map((value) => value.buildingId + ";" + value.level).join("|") ?? ""
  );
}

export function buildingItemCosts(state: BuildingState): string | undefined {
  return state.requiredItems
    ?.map(
      (value) => String(value.itemId) + (value.quantity === undefined ? "" : ";" + value.quantity),
    )
    .join("|");
}

export function buildingUnlockValues(state: BuildingState): { types: string; values: string } {
  if (state.unlockConditions !== undefined)
    return {
      types: state.unlockConditions.map((value) => value.code).join(";"),
      values: state.unlockConditions.map((value) => value.value ?? "").join(";"),
    };
  return {
    types:
      state.upgrades?.unlockConditions
        ?.map((step) => step.progress + ";" + step.value.code)
        .join("|") ?? "",
    values:
      state.upgrades?.unlockConditions
        ?.map((step) => step.progress + ";" + step.value.value)
        .join("|") ?? "",
  };
}
