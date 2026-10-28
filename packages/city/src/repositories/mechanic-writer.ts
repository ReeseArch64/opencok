import { user_branch_city_info } from "@opencok/drizzle/schema/opencok_kingdom/user_branch_city_info";
import type { CityProgressionWrite } from "@opencok/contracts/city-progression";
import type { CityPersistenceSession } from "../contracts/persistence-session";

export class CityMechanicWriter
{
    public constructor(private readonly session: CityPersistenceSession)
    {}

    public readonly persist = async (write: CityProgressionWrite) => {
        const session = this.session;
        const { tx, owner, now, writers } = session;
        if (write.monsterExchange)
        {
            await writers.writeMonsterExchanges(tx, owner, write.monsterExchange);
        }

        if (write.fragmentExchange)
        {
            await writers.writeFragmentExchanges(tx, owner, write.fragmentExchange);
        }

        if (write.cosmeticTarget)
        {
            await writers.writeCosmeticTarget(
                tx,
                owner,
                session.cosmeticTarget?.uid,
                write.cosmeticTarget,
            );
        }

        if (write.costRankAward)
        {
            await writers.writeCostRankAward(tx, owner, write.costRankAward, now);
        }

        if (write.expeditionAward)
        {
            await writers.writeExpeditionAward(tx, owner, write.expeditionAward, now);
        }

        if (write.heroRankingAward)
        {
            await writers.writeHeroRankAward(tx, owner, write.heroRankingAward, now);
        }

        if (write.heroScore)
        {
            await writers.writeHeroScore(tx, owner, session.alliance, write.heroScore);
        }

        if (write.olympic)
        {
            await writers.writeOlympic(tx, owner, write.olympic);
        }

        if (write.cupBetting)
        {
            await writers.writeCupBetting(tx, owner, write.cupBetting);
        }

        if (write.groupBuy)
        {
            await writers.writeGroupBuy(tx, owner, write.groupBuy);
        }

        if (write.specialEventPurchase)
        {
            await writers.writeSpecialEventPurchase(tx, owner, write.specialEventPurchase);
        }

        if (write.continuedCostHide !== undefined)
        {
            await writers.writeContinuedCostHide(tx, owner, write.continuedCostHide);
        }

        if (write.continuedCost)
        {
            await writers.writeContinuedCost(tx, owner, write.continuedCost);
        }

        if (write.troubleHistory)
        {
            await writers.writeTrouble(tx, owner, write.troubleHistory);
        }

        if (write.comeback)
        {
            await writers.writeComeback(tx, owner, write.comeback);
        }

        if (write.hotItem)
        {
            await writers.writeHotItems(tx, owner, write.hotItem);
        }

        if (write.prayer)
        {
            await writers.writePrayer(tx, owner, write.prayer);
        }

        if (write.recallTask)
        {
            await writers.writeRecallTasks(tx, owner, write.recallTask);
        }

        if (write.regionalRecall)
        {
            await writers.writeRegionalRecall(tx, owner, write.regionalRecall);
        }

        if (write.allianceHeart)
        {
            await writers.writeAllianceHeart(tx, owner, write.allianceHeart);
        }

        if (write.playerItemGifts)
        {
            await writers.writePlayerItemGifts(tx, owner, write.playerItemGifts);
        }

        if (write.seasonalExchange)
        {
            await writers.writeSeasonalExchange(tx, owner, write.seasonalExchange);
        }

        if (write.vipBox)
        {
            await writers.writeVipBox(tx, owner, write.vipBox);
        }

        if (write.targetTask)
        {
            await writers.writeTargetTasks(tx, owner, write.targetTask);
        }

        if (write.redPackets)
        {
            await writers.writeRedPackets(tx, owner, write.redPackets);
        }

        if (write.militaryAward)
        {
            await writers.writeMilitaryRankAward(tx, owner, write.militaryAward, now);
        }

        if (write.activityRewardClaim)
        {
            await writers.writeActivityReward(tx, owner, write.activityRewardClaim);
        }

        if (write.rechargeFeedback)
        {
            await writers.writeRechargeFeedback(tx, owner, write.rechargeFeedback, now);
        }

        if (write.eggActivity)
        {
            await writers.writeEggActivity(tx, owner, write.eggActivity);
        }

        if (write.goldEggs)
        {
            await writers.writeGoldEggs(tx, owner, write.goldEggs, now);
        }

        if (write.normalRecharge)
        {
            await writers.writeNormalRecharge(tx, owner, write.normalRecharge, now);
        }

        if (write.rechargeActivity)
        {
            await writers.writeRechargeActivity(tx, owner, write.rechargeActivity);
        }

        if (write.ordinaryBox)
        {
            await writers.writeOrdinaryBox(tx, owner, write.ordinaryBox);
        }

        if (write.sevenDayCycle)
        {
            await writers.writeSevenDayCycle(tx, owner, write.sevenDayCycle);
        }

        if (write.shippingInvestment)
        {
            await writers.writeShippingInvestment(tx, owner, write.shippingInvestment);
        }

        if (write.branchCityOpenState !== undefined)
        {
            await tx
                .insert(user_branch_city_info)
                .values({
                    uid: owner,
                    openstate: write.branchCityOpenState,
                    takerewardcount: 0,
                })
                .onConflictDoUpdate({
                    target: user_branch_city_info.uid,
                    set: { openstate: write.branchCityOpenState },
                });
        }

        if (write.dailyInvestment)
        {
            await writers.writeDailyInvestment(tx, owner, write.dailyInvestment);
        }

        if (write.castleLevelEvent || write.castleLevelEnrollments)
        {
            await writers.writeCastleLevelEvent(
                tx,
                owner,
                write.castleLevelEvent ?? [],
                write.castleLevelEnrollments ?? [],
            );
        }

        if (write.luckyDay)
        {
            await writers.writeLuckyDay(tx, owner, write.luckyDay);
        }

        if (write.dragonTower)
        {
            await writers.writeDragonTower(tx, owner, write.dragonTower);
        }

        if (write.expedition)
        {
            await writers.writeExpedition(tx, owner, write.expedition);
        }

        if (write.arena)
        {
            await writers.writeArena(tx, owner, write.arena);
        }

        if (write.campaignVariables)
        {
            await writers.writeCampaignVariables(tx, owner, write.campaignVariables, now);
        }

        if (write.lottery)
        {
            await writers.writeLottery(tx, owner, write.lottery);
        }

        if (write.totems)
        {
            await writers.writeTotems(tx, owner, write.totems);
        }

        if (write.civilizationCastle)
        {
            await writers.writeCivilizationCastle(tx, owner, write.civilizationCastle);
        }

        if (write.worldMutation)
        {
            await writers.writeWorldMutation(tx, owner, write.worldMutation);
        }

        if (write.dragons)
        {
            await writers.writeDragonProgression(tx, owner, write.dragons);
        }

        await writers.writePlayerEffects(tx, owner, write);

        await session.equipment.writeEquipment(write);

        if (write.quests)
        {
            await writers.writeQuests(tx, owner, write.quests, session.questBefore);
        }
    };
}
