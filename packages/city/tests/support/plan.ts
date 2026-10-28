import type { CityProgressionState } from "@opencok/contracts/city-progression";
import type { ActivityEconomy } from "@opencok/economy/contracts/activity-economy";
import { Rules } from "@opencok/rules/game";
import { CityProgressionContext } from "../../src/services/context";

export function createPlan()
{
    const profile = { uid: "owner" };
    const state: CityProgressionState = {
        profile,
        resource: {},
        statistics: {},
        buildingExperience: {},
        buildings: [],
        sciences: [],
        armies: [],
        hospital: [],
        forts: [],
        queues: [],
        skills: [],
        tasks: [],
        achievements: [],
        equipment: [],
        glory: {},
        newGenerals: { moved: false, generals: [], statuses: [], equipment: [], offices: [] },
        effects: {
            profile,
            generals: [],
            sciences: [],
            civilizationSciences: [],
            sagaSciences: [],
            foreignSciences: [],
            equipment: [],
            heroes: [],
            dragons: [],
            dragonSkills: [],
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
        },
    };
    const economy: ActivityEconomy = {
        gold()
        {},
        resource()
        {},
        item()
        {},
    };

    return new CityProgressionContext(
        state,
        new Rules(new Map(), new Map(), new Map()),
        1000n,
        economy,
        () => 0,
    );
}
