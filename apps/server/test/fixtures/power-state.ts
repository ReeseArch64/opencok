import type { PowerState } from "@opencok/contracts/power";
import type { Row } from "@opencok/contracts/rows";

export function emptyPowerState(profile: Row): PowerState {
  return {
    profile,
    statistics: undefined,
    generals: [],
    armies: [],
    walls: [],
    buildings: [],
    sciences: [],
    civilizationSciences: [],
    sagaSciences: [],
    foreignSciences: [],
    equipment: [],
    heroes: [],
    dragons: [],
    dragonSkills: [],
    knight: undefined,
    items: [],
    states: [],
    vip: undefined,
    allianceSciences: [],
    prestige: [],
    military: undefined,
    miracle: undefined,
    office: undefined,
    kingdomFights: [],
    territoryTrees: [],
    luckyDay: undefined,
    powerServer: undefined,
    throneRewards: [],
    upload: undefined,
  };
}
