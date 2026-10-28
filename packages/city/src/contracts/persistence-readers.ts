import type {
    CityProgressionState,
    CityProgressionStore,
} from "@opencok/contracts/city-progression";
import type { Row } from "@opencok/contracts/rows";
import type { CityTransaction } from "./transaction";

type CityReadField<K extends keyof CityProgressionState, TArgs extends unknown[] = []> = (
    tx: CityTransaction,
    owner: string,
    ...args: TArgs
) => Promise<CityProgressionState[K]>;

type CityReadFactory<K extends keyof CityProgressionState, TArgs extends unknown[] = []> = (
    tx: CityTransaction,
    owner: string,
    ...args: TArgs
) => CityProgressionState[K];

export interface CityPersistenceReaders
{
    militaryRankAwardReader: CityReadFactory<"militaryAward">;
    activityRewardReader: CityReadFactory<"activityReward">;
    redPacketReader: CityReadFactory<"redPackets">;
    readEggActivity: CityReadField<"eggActivity">;
    goldEggsReader: CityReadFactory<"goldEggs", [realm: number, now: bigint]>;
    readNormalRecharge: CityReadField<"normalRecharge", [now: bigint, initialize: boolean]>;
    readComeback: CityReadField<"comeback", [profile: Row]>;
    readHotItems: CityReadField<"hotItem", [now: bigint]>;
    worldMonsterReader: (
        tx: CityTransaction,
        size: number,
    ) => CityProgressionState["worldMonsters"];
    readMonsterExchanges: CityReadField<"monsterExchange">;
    readFragmentExchanges: CityReadField<"fragmentExchange">;
    readCampaignProfile: CityReadField<"campaignProfile">;
    costRankAwardReader: CityReadFactory<"costRankAward">;
    expeditionAwardReader: CityReadFactory<"expeditionAward">;
    heroRankAwardReader: CityReadFactory<"heroRankingAward">;
    heroScoreReader: CityReadFactory<"heroScore", [alliance: string]>;
    readOlympic: CityReadField<"olympic">;
    readCupBetting: CityReadField<"cupBetting">;
    readGroupBuy: CityReadField<"groupBuy">;
    readContinuedCost: CityReadFactory<"continuedCost">;
    readTrouble: CityReadField<"trouble", [history: boolean]>;
    readCosmeticTarget: (
        tx: CityTransaction,
        request?: Uint8Array,
        actor?: string,
    ) => Promise<CityProgressionState["cosmeticTarget"]>;
    readPrayer: CityReadField<"prayer">;
    readRecallTasks: CityReadField<"recallTask", [countryNeeded: boolean]>;
    readRegionalRecall: CityReadField<"regionalRecall", [realm: number, initialize: boolean]>;
    readAllianceHeart: CityReadField<"allianceHeart", [command: string, request?: Uint8Array]>;
    readPlayerItemGifts: CityReadField<"playerItemGifts", [command: string, request?: Uint8Array]>;
    readSeasonalExchange: CityReadField<"seasonalExchange">;
    readVipBox: CityReadField<"vipBox">;
    readTargetTasks: CityReadField<"targetTask">;
    rechargeFeedbackReader: CityReadFactory<"rechargeFeedback">;
    readRechargeActivity: CityReadField<"rechargeActivity">;
    readOrdinaryBoxServer: (
        tx: CityTransaction,
    ) => Promise<CityProgressionState["ordinaryBoxServer"]>;
    readSevenDayCycle: CityReadField<"sevenDayCycle">;
    readDailyInvestment: CityReadField<"dailyInvestment">;
    readCastleLevelEvent: CityReadField<"castleLevelEvent">;
    readLuckyDay: CityReadField<"luckyDay">;
    readDragonTower: CityReadField<
        "dragonTower",
        [now: bigint, realm: number, request?: Uint8Array]
    >;
    readExpedition: (
        tx: CityTransaction,
        profile: Row,
        now: bigint,
        command?: string,
        request?: Uint8Array,
    ) => Promise<NonNullable<CityProgressionState["expedition"]>>;
    readArena: CityReadField<"arena">;
    readAnniversaryStatistics: CityReadField<"anniversaryStatistics">;
    readCampaignVariables: CityReadField<"campaignVariables", [kingdomId: number]>;
    readLottery: CityReadField<"lottery">;
    readTotems: CityReadField<"totems">;
    readCivilizationCastle: (
        tx: CityTransaction,
        owner: string,
        request?: Uint8Array,
    ) => Promise<Pick<CityProgressionState, "civilizationCastle" | "civilizationCastleTarget">>;
    readWorldMutationState: CityReadField<
        "worldMutation",
        [request: Uint8Array | undefined, size: number, command?: string]
    >;
    readDragonProgression: CityReadField<"dragons">;
    readGeneralRoster: CityReadField<
        "generalRoster",
        [command?: string, ranking?: Parameters<CityProgressionStore["getState"]>[1]]
    >;
    readAbilityPages: CityReadField<"abilityPages">;
    readProgressionEffects: CityReadField<"effects", [effects: CityProgressionState["effects"]]>;
    readQuests: CityReadField<"quests", [profile: Row, now: bigint]>;
    readResourceNewGenerals: CityReadField<"newGenerals", [moved: boolean]>;
    readPlayerEffects: (
        tx: CityTransaction,
        profile: Row,
        bounded?: boolean,
    ) => Promise<CityProgressionState["effects"]>;
}
