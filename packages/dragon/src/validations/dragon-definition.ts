import { DragonInteraction } from "@opencok/enums/dragon-interaction";
import type { DragonDefinition } from "../contracts/dragon-definition.ts";

export function validateDragonDefinition(dragon: DragonDefinition): void {
  const invalid = () => {
    throw new Error(`Invalid dragon definition: ${dragon.name}`);
  };
  const integer = (value: number, minimum = 0) => {
    if (!Number.isSafeInteger(value) || value < minimum) {invalid();}
  };
  integer(dragon.hatchingSeconds, 1);
  integer(dragon.renameGoldCost);
  integer(dragon.sustainedFeeding.bonusMultiplier, 1);
  integer(dragon.sustainedFeeding.bonusEveryFeedings, 1);

  if (dragon.server) {
    integer(dragon.server.initialPower);
    integer(dragon.server.initialLevel, 1);
  }

  if (!dragon.skillSlots.length || !dragon.gifts.length) {invalid();}

  for (const slot of dragon.skillSlots) {
    integer(slot.unlockLevel);

    if (slot.maximumQualityRank !== undefined) {integer(slot.maximumQualityRank);}
    else if (dragon.server) {invalid();}
  }

  const actions = Object.values(DragonInteraction);

  if (dragon.interactions.length !== actions.length) {invalid();}

  for (const [index, interaction] of dragon.interactions.entries()) {
    if (interaction.action !== actions[index]) {invalid();}

    integer(interaction.cooldownSeconds);
    integer(interaction.minimumFriendship);
  }

  if (dragon.reputation) {integer(dragon.reputation.minimumLevel, 1);}
}
