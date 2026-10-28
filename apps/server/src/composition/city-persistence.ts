import { ResearchRepository } from "@opencok/research/repositories/progression";
import {
    militaryRankAwardReader,
    writeMilitaryRankAward,
} from "@opencok/repositories/military-rank-awards";
import { activityRewardReader, writeActivityReward } from "@opencok/repositories/activity-reward";
import { redPacketReader, writeRedPackets } from "@opencok/repositories/red-packets";
import { readEggActivity, writeEggActivity } from "@opencok/repositories/egg-activity";
import { goldEggsReader, writeGoldEggs } from "@opencok/repositories/gold-eggs";
import { readNormalRecharge, writeNormalRecharge } from "@opencok/repositories/normal-recharge";
import { readComeback, writeComeback } from "@opencok/repositories/comeback";
import { readHotItems, writeHotItems } from "@opencok/repositories/hot-item";
import { allocateWorldBirth } from "@opencok/repositories/world-birth";
import type { RealmAuthority } from "@opencok/repositories/realm-authority";
import { worldMonsterReader } from "@opencok/repositories/world-monsters";
import {
    readMonsterExchanges,
    writeMonsterExchanges,
} from "@opencok/repositories/monster-exchange";
import {
    readFragmentExchanges,
    writeFragmentExchanges,
} from "@opencok/repositories/fragment-exchange";
import { readCampaignProfile } from "@opencok/repositories/campaign-notice";
import {
    costRankAwardReader,
    writeCostRankAward,
} from "@opencok/repositories/continued-cost-rewards";
import {
    expeditionAwardReader,
    writeExpeditionAward,
} from "@opencok/repositories/expedition-stage-rewards";
import {
    heroRankAwardReader,
    writeHeroRankAward,
} from "@opencok/hero/repositories/hero-ranking-rewards";
import { heroScoreReader, writeHeroScore } from "@opencok/hero/repositories/hero-score";
import { readOlympic, writeOlympic } from "@opencok/repositories/olympic";
import { readCupBetting, writeCupBetting } from "@opencok/repositories/cup-betting";
import { readGroupBuy, writeGroupBuy } from "@opencok/repositories/groupbuy";
import { writeSpecialEventPurchase } from "@opencok/repositories/special-event";
import {
    readContinuedCost,
    writeContinuedCost,
    writeContinuedCostHide,
} from "@opencok/repositories/continued-cost";
import { readTrouble, writeTrouble } from "@opencok/repositories/trouble";
import { readCosmeticTarget, writeCosmeticTarget } from "@opencok/repositories/city-cosmetics";
import { readPrayer, writePrayer } from "@opencok/repositories/prayer";
import { readRecallTasks, writeRecallTasks } from "@opencok/repositories/recall-task";
import { readRegionalRecall, writeRegionalRecall } from "@opencok/repositories/regional-recall";
import { readAllianceHeart, writeAllianceHeart } from "@opencok/repositories/alliance-heart";
import { readPlayerItemGifts, writePlayerItemGifts } from "@opencok/repositories/player-item-gifts";
import {
    readSeasonalExchange,
    writeSeasonalExchange,
} from "@opencok/repositories/seasonal-exchange";
import { readVipBox, writeVipBox } from "@opencok/repositories/vip-box";
import { readTargetTasks, writeTargetTasks } from "@opencok/repositories/target-task";
import {
    rechargeFeedbackReader,
    writeRechargeFeedback,
} from "@opencok/repositories/recharge-feedback";
import {
    readRechargeActivity,
    writeRechargeActivity,
} from "@opencok/repositories/recharge-activity";
import { readOrdinaryBoxServer, writeOrdinaryBox } from "@opencok/repositories/ordinary-box";
import { readSevenDayCycle, writeSevenDayCycle } from "@opencok/repositories/seven-day-cycle";
import { writeShippingInvestment } from "@opencok/repositories/shipping-investment";
import { readDailyInvestment, writeDailyInvestment } from "@opencok/repositories/daily-investment";
import {
    readCastleLevelEvent,
    writeCastleLevelEvent,
} from "@opencok/repositories/castle-level-event";
import { readLuckyDay, writeLuckyDay } from "@opencok/repositories/lucky-day";
import { readDragonTower, writeDragonTower } from "@opencok/repositories/dragon-tower";
import { readExpedition, writeExpedition } from "@opencok/repositories/new-expedition";
import { readArena, writeArena } from "@opencok/repositories/arena";
import { readAnniversaryStatistics } from "@opencok/repositories/anniversary";
import {
    readCampaignVariables,
    writeCampaignVariables,
} from "@opencok/repositories/local-campaign";
import { readLottery, writeLottery } from "@opencok/repositories/lottery";
import { readTotems, writeTotems } from "@opencok/repositories/totem";
import {
    readCivilizationCastle,
    writeCivilizationCastle,
} from "@opencok/repositories/civilization-castle";
import {
    readWorldMutationState,
    writeWorldMutation,
} from "@opencok/repositories/world-march-runtime";
import {
    readDragonProgression,
    writeDragonProgression,
} from "@opencok/repositories/dragon-progression";
import { readGeneralRoster, writeGeneralRoster } from "@opencok/hero/repositories/generals";
import { readSuitDecompositions, writeEquipment } from "@opencok/repositories/equipment";
import {
    readAbilityPages,
    readProgressionEffects,
    writePlayerEffects,
} from "@opencok/repositories/player-effects";
import { readQuests, writeQuests } from "@opencok/repositories/quests";
import { readResourceNewGenerals } from "@opencok/hero/repositories/general-resource-owner";
import { readPlayerEffects } from "@opencok/repositories/power";
import { CityProgressionRepository } from "@opencok/city/repositories/progression";
import type { CityTransaction, CityProductionBoundary } from "@opencok/city/contracts/transaction";
import type { CityPersistenceReaders } from "@opencok/city/contracts/persistence-readers";
import type { CityPersistenceWriters } from "@opencok/city/contracts/persistence-writers";
import type { CityProgressionStore } from "@opencok/contracts/city-progression";

const readers: CityPersistenceReaders = {
    militaryRankAwardReader,
    activityRewardReader,
    redPacketReader,
    readEggActivity,
    goldEggsReader,
    readNormalRecharge,
    readComeback,
    readHotItems,
    worldMonsterReader,
    readMonsterExchanges,
    readFragmentExchanges,
    readCampaignProfile,
    costRankAwardReader,
    expeditionAwardReader,
    heroRankAwardReader,
    heroScoreReader,
    readOlympic,
    readCupBetting,
    readGroupBuy,
    readContinuedCost,
    readTrouble,
    readCosmeticTarget,
    readPrayer,
    readRecallTasks,
    readRegionalRecall,
    readAllianceHeart,
    readPlayerItemGifts,
    readSeasonalExchange,
    readVipBox,
    readTargetTasks,
    rechargeFeedbackReader,
    readRechargeActivity,
    readOrdinaryBoxServer,
    readSevenDayCycle,
    readDailyInvestment,
    readCastleLevelEvent,
    readLuckyDay,
    readDragonTower,
    readExpedition,
    readArena,
    readAnniversaryStatistics,
    readCampaignVariables,
    readLottery,
    readTotems,
    readCivilizationCastle,
    readWorldMutationState,
    readDragonProgression,
    readGeneralRoster,
    readSuitDecompositions,
    readAbilityPages,
    readProgressionEffects,
    readQuests,
    readResourceNewGenerals,
    readPlayerEffects,
};

const writers: CityPersistenceWriters = {
    writeMilitaryRankAward,
    writeActivityReward,
    writeRedPackets,
    writeEggActivity,
    writeGoldEggs,
    writeNormalRecharge,
    writeComeback,
    writeHotItems,
    writeMonsterExchanges,
    writeFragmentExchanges,
    writeCostRankAward,
    writeExpeditionAward,
    writeHeroRankAward,
    writeHeroScore,
    writeOlympic,
    writeCupBetting,
    writeGroupBuy,
    writeSpecialEventPurchase,
    writeContinuedCost,
    writeContinuedCostHide,
    writeTrouble,
    writeCosmeticTarget,
    writePrayer,
    writeRecallTasks,
    writeRegionalRecall,
    writeAllianceHeart,
    writePlayerItemGifts,
    writeSeasonalExchange,
    writeVipBox,
    writeTargetTasks,
    writeRechargeFeedback,
    writeRechargeActivity,
    writeOrdinaryBox,
    writeSevenDayCycle,
    writeShippingInvestment,
    writeDailyInvestment,
    writeCastleLevelEvent,
    writeLuckyDay,
    writeDragonTower,
    writeExpedition,
    writeArena,
    writeCampaignVariables,
    writeLottery,
    writeTotems,
    writeCivilizationCastle,
    writeWorldMutation,
    writeDragonProgression,
    writeGeneralRoster,
    writeEquipment,
    writePlayerEffects,
    writeQuests,
};

export function createRealmCityProgressionStore(
    tx: CityTransaction,
    owner: string,
    now: bigint,
    boundary: CityProductionBoundary,
    mapSize = 1200,
    authority?: RealmAuthority,
): CityProgressionStore
{
    return new CityProgressionRepository(tx, owner, now, boundary, {
        readers,
        writers,
        research: new ResearchRepository(tx, owner),
        birth: authority
            ? (rules, mode) => allocateWorldBirth(tx, authority, mapSize, rules, now, mode)
            : undefined,
    }, mapSize);
}
