import type {
  BuildingEffects,
  BuildingLevelDefinition,
  BuildingState,
  BuildingStep,
} from "@opencok/contracts/building";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

export function buildingStep<T>(
  steps: readonly BuildingStep<T>[] | undefined,
  progress: number,
  next = false,
): BuildingStep<T> | undefined {
  if (!steps) return undefined;

  let index = -1;

  while (index + 1 < steps.length && steps[index + 1]!.progress <= progress) index++;

  return steps[index + (next ? 1 : 0)];
}

export function buildingLevel(
  catalog: ReadonlyMap<number, BuildingLevelDefinition>,
  itemId: string,
  level: number,
  star = 0,
  progress = 0,
): BuildingState {
  if (
    !/^\d{6}$/.test(itemId) ||
    ![level, star, progress].every(Number.isInteger) ||
    level < 0 ||
    level > 30 ||
    star < 0 ||
    progress < 0 ||
    progress >= 100 ||
    (level < 30 && star !== 0)
  )
    throw new GameError(errors.unsupported, "building_shape");

  const definition = catalog.get(Number(itemId) + level + star);

  if (!definition || definition.level !== level)
    throw new GameError(errors.unsupported, "building_rule");

  const result: BuildingState = { ...definition, starLevel: star, starProgress: progress };

  if (level < 30) return result;

  const upgrades = definition.upgrades;
  const effects: Partial<Record<keyof BuildingEffects, number>> = { ...definition.effects };

  for (const [name, steps] of Object.entries(definition.effectSteps ?? {})) {
    const step = buildingStep(steps, progress);

    if (step) effects[name as keyof BuildingEffects] = step.value;
  }

  const unlock = upgrades?.unlockConditions?.find((step) => step.progress === progress + 10);

  return {
    ...result,
    constructionSeconds:
      buildingStep(upgrades?.constructionSeconds, progress, true)?.value ??
      definition.constructionSeconds,
    experience: buildingStep(upgrades?.experience, progress, true)?.value ?? definition.experience,
    power: buildingStep(upgrades?.power, progress)?.value ?? definition.power,
    costs: { ...definition.costs, ...buildingStep(upgrades?.costs, progress, true)?.value },
    requiredItems:
      buildingStep(upgrades?.requiredItems, progress, true)?.value ?? definition.requiredItems,
    requiredStarBuildings: buildingStep(upgrades?.requiredBuildings, progress, true)?.value,
    unlockConditions: unlock ? [unlock.value] : definition.unlockConditions,
    unlockPayment: upgrades?.unlockPayment?.find((step) => step.progress === progress + 10)?.value,
    effects,
  };
}

export function nextBuildingLevel(
  catalog: ReadonlyMap<number, BuildingLevelDefinition>,
  itemId: string,
  level: number,
  star: number,
  progress: number,
  maximumStar: number,
): BuildingState {
  const current = buildingLevel(catalog, itemId, level, star, progress);

  if (level < 30) return buildingLevel(catalog, itemId, level + 1, star, progress);

  if (star >= maximumStar) return current;

  const next =
    buildingStep(current.upgrades?.constructionSeconds, progress, true)?.progress ?? progress + 10;

  return buildingLevel(
    catalog,
    itemId,
    level,
    star + (next >= 100 ? 1 : 0),
    next >= 100 ? 0 : next,
  );
}
