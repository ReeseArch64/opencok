import type { CityProgressionState } from "@opencok/contracts/city-progression";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import type { Rules } from "@opencok/rules/game";
import { CityProgressionContext } from "@opencok/city/services/context";

export function cityFixture(rules: Rules, effect: (id: number) => number = () => 0)
{
    const profile = { uid: "owner", serverId: 1, level: 1, exp: 0, gold: 100000n },
        resource = {
            uid: "owner",
            wood: 1000n,
            woodbind: 50n,
            food: 100000n,
            stone: 10000n,
            iron: 10000n,
            silver: 1000,
        };
    const state: CityProgressionState = {
        profile,
        resource,
        statistics: { power: 1000n, buildingPower: 100n, armyCure: 0 },
        buildingExperience: {},
        buildings: [
            {
                uid: "owner",
                uuid: "wood",
                itemId: 413000,
                level: 1,
                star: 0,
                progress: 0,
                opType: 0,
                pos: 17,
            },
        ],
        skills: [],
        sciences: [],
        armies: [],
        hospital: [],
        forts: [],
        queues: [],
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
    const balances = new Map(
        Object.entries(resource)
            .filter(([key]) => key !== "uid")
            .map(([key, value]) => [key, BigInt(String(value))]),
    );
    balances.set("gold", profile.gold);
    const items = new Map<string, number>();
    const economy = {
        balance: (asset: string) => balances.get(asset) ?? 0n,
        quantity: (id: string) => items.get(id) ?? 0,
        gold: (delta: bigint) => {
            balances.set("gold", cityAmount(balances.get("gold")! + delta));
        },
        resource: (asset: string, delta: bigint) => {
            balances.set(asset, cityAmount((balances.get(asset) ?? 0n) + delta));
        },
        item: (id: string, delta: number) => {
            items.set(id, cityInteger((items.get(id) ?? 0) + delta));
        },
    };
    return {
        state,
        balances,
        items,
        context: new CityProgressionContext(state, rules, 1000000n, economy, effect),
    };
}
