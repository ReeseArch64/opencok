import type { CityProgressionWrite } from "@opencok/contracts/city-progression";
import type { CityTransaction } from "./transaction";

type CityWriteField<K extends keyof CityProgressionWrite, TArgs extends unknown[] = []> = (
    tx: CityTransaction,
    owner: string,
    write: NonNullable<CityProgressionWrite[K]>,
    ...args: TArgs
) => Promise<unknown>;

export interface CityPersistenceWriters
{
    writeMilitaryRankAward: CityWriteField<"militaryAward", [now: bigint]>;
    writeActivityReward: CityWriteField<"activityRewardClaim">;
    writeRedPackets: CityWriteField<"redPackets">;
    writeEggActivity: CityWriteField<"eggActivity">;
    writeGoldEggs: CityWriteField<"goldEggs", [now: bigint]>;
    writeNormalRecharge: CityWriteField<"normalRecharge", [now: bigint]>;
    writeComeback: CityWriteField<"comeback">;
    writeHotItems: CityWriteField<"hotItem">;
    writeMonsterExchanges: CityWriteField<"monsterExchange">;
    writeFragmentExchanges: CityWriteField<"fragmentExchange">;
    writeCostRankAward: CityWriteField<"costRankAward", [now: bigint]>;
    writeExpeditionAward: CityWriteField<"expeditionAward", [now: bigint]>;
    writeHeroRankAward: CityWriteField<"heroRankingAward", [now: bigint]>;
    writeHeroScore: (
        tx: CityTransaction,
        owner: string,
        alliance: string,
        write: NonNullable<CityProgressionWrite["heroScore"]>,
    ) => Promise<unknown>;
    writeOlympic: CityWriteField<"olympic">;
    writeCupBetting: CityWriteField<"cupBetting">;
    writeGroupBuy: CityWriteField<"groupBuy">;
    writeSpecialEventPurchase: CityWriteField<"specialEventPurchase">;
    writeContinuedCost: CityWriteField<"continuedCost">;
    writeContinuedCostHide: CityWriteField<"continuedCostHide">;
    writeTrouble: CityWriteField<"troubleHistory">;
    writeCosmeticTarget: (
        tx: CityTransaction,
        owner: string,
        target: string | undefined,
        write: NonNullable<CityProgressionWrite["cosmeticTarget"]>,
    ) => Promise<unknown>;
    writePrayer: CityWriteField<"prayer">;
    writeRegionalRecall: CityWriteField<"regionalRecall">;
    writeAllianceHeart: CityWriteField<"allianceHeart">;
    writePlayerItemGifts: CityWriteField<"playerItemGifts">;
    writeSeasonalExchange: CityWriteField<"seasonalExchange">;
    writeVipBox: CityWriteField<"vipBox">;
    writeRechargeFeedback: CityWriteField<"rechargeFeedback", [now: bigint]>;
    writeRechargeActivity: CityWriteField<"rechargeActivity">;
    writeOrdinaryBox: CityWriteField<"ordinaryBox">;
    writeSevenDayCycle: CityWriteField<"sevenDayCycle">;
    writeShippingInvestment: CityWriteField<"shippingInvestment">;
    writeDailyInvestment: CityWriteField<"dailyInvestment">;
    writeCastleLevelEvent: (
        tx: CityTransaction,
        owner: string,
        rows: NonNullable<CityProgressionWrite["castleLevelEvent"]>,
        enrollments: NonNullable<CityProgressionWrite["castleLevelEnrollments"]>,
    ) => Promise<unknown>;
    writeLuckyDay: CityWriteField<"luckyDay">;
    writeDragonTower: CityWriteField<"dragonTower">;
    writeExpedition: CityWriteField<"expedition">;
    writeArena: CityWriteField<"arena">;
    writeCampaignVariables: CityWriteField<"campaignVariables", [now: bigint]>;
    writeLottery: CityWriteField<"lottery">;
    writeTotems: CityWriteField<"totems">;
    writeCivilizationCastle: CityWriteField<"civilizationCastle">;
    writeWorldMutation: CityWriteField<"worldMutation">;
    writeDragonProgression: CityWriteField<"dragons">;
    writeGeneralRoster: CityWriteField<"generalRoster", [now: bigint]>;
    writePlayerEffects: (
        tx: CityTransaction,
        owner: string,
        write: CityProgressionWrite,
    ) => Promise<unknown>;
}
