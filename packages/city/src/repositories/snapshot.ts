import { user_branch_city_info } from "@opencok/drizzle/schema/opencok_kingdom/user_branch_city_info";
import { activity_minstrel } from "@opencok/drizzle/schema/opencok_kingdom/activity_minstrel";
import { user_skill } from "@opencok/drizzle/schema/opencok_kingdom/user_skill";
import { and, eq } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { user_achievement } from "@opencok/drizzle/schema/opencok_kingdom/user_achievement";
import { user_glory_info } from "@opencok/drizzle/schema/opencok_kingdom/user_glory_info";
import type { CityProgressionStore } from "@opencok/contracts/city-progression";
import { num } from "@opencok/contracts/rows";
import type { CityPersistenceSession } from "../contracts/persistence-session";

export class CitySnapshotReader
{
    public constructor(private readonly session: CityPersistenceSession)
    {}

    public readonly getState: CityProgressionStore["getState"] = async (
        command,
        ranking,
        request,
    ) => {
        const session = this.session;
        const { tx, owner, now, mapSize, readers } = session;
        const [profile] = await tx.select().from(userprofile).where(eq(userprofile.uid, owner));
        const [resource] = await tx.select().from(user_resource).where(
            eq(user_resource.uid, owner),
        );

        if (!profile || !resource)
        {
            throw new Error("Missing city owner");
        }

        const [statistics] = await tx.select().from(playerinfo).where(
            eq(playerinfo.uid, owner),
        );
        const [buildingExperience] = await session.buildings.readExperience();
        const buildings = await session.buildings.read();
        const sciences = await session.research.read();
        const armies = await session.troops.readArmies();
        const hospital = await session.troops.readHospital();
        const forts = await session.troops.readForts();
        const queues = await tx.select().from(queue).where(eq(queue.ownerId, owner)).limit(257);

        if (
            buildings.length > 256
            || sciences.length > 4096
            || armies.length > 1024
            || hospital.length > 1024
            || forts.length > 1024
            || queues.length > 256
        )
        {
            throw new Error("City aggregate exceeds bound");
        }

        const skills = await tx.select().from(user_skill).where(eq(user_skill.ownerId, owner));
        const tasks = await session.quests.readTasks();
        const achievements = await tx
            .select()
            .from(user_achievement)
            .where(eq(user_achievement.uid, owner));
        const equipment = await session.equipment.read();
        const [glory] = await tx.select().from(user_glory_info).where(
            eq(user_glory_info.uid, owner),
        );
        const civilizationSciences = await session.research.readCivilization();

        if (civilizationSciences.length > 4096)
        {
            throw new Error("Civilization science aggregate exceeds bound");
        }

        session.alliance = profile.allianceId ?? "";
        const worldMutation = command?.startsWith("world.")
                || command === "get.act.boss.point"
                || command === "create.boss"
                || command?.startsWith("treasuremap.")
                || command === "buy.citydef"
                || command === "resource.new.detail"
                || command === "common.res.syn"
                || command === "totem"
                || command === "civilizationCastle"
            ? await readers.readWorldMutationState(tx, owner, request, mapSize, command)
            : undefined;

        const quests = await session.quests.readQuests(profile, now);
        session.questBefore = structuredClone({ tasks, quests });

        return {
            militaryAward: command === "activity.accept.reward"
                ? readers.militaryRankAwardReader(tx, owner)
                : undefined,
            activityReward: command === "activity.accept.reward"
                ? readers.activityRewardReader(tx, owner)
                : undefined,
            redPackets: command?.startsWith("redPackets.") || command === "campaign.paid.gift"
                ? readers.redPacketReader(tx, owner)
                : undefined,
            worldMonsters: [
                    "world.use",
                    "create.boss",
                    "world.get.monster",
                    "world.get.barbarion",
                    "get.act.boss.point",
                ].includes(command ?? "")
                ? readers.worldMonsterReader(tx, mapSize)
                : undefined,
            campaignProfile: command?.startsWith("egg.")
                    || command?.startsWith("goldeggs.")
                    || command?.startsWith("normal.recharge.")
                    || command?.startsWith("campaign.")
                    || command === "activity.accept.reward"
                    || command === "world.march"
                    || command?.startsWith("redPackets.")
                    || command === "trigger.activity"
                    || command?.startsWith("hot.item.")
                ? await readers.readCampaignProfile(tx, owner)
                : undefined,
            costRankAward: command === "continuedcost.rank.deliver"
                ? readers.costRankAwardReader(tx, owner)
                : undefined,
            expeditionAward: command === "expedition.award.deliver"
                ? readers.expeditionAwardReader(tx, owner)
                : undefined,
            heroRankingAward: command === "hero.rank.deliver"
                ? readers.heroRankAwardReader(tx, owner)
                : undefined,
            comeback: command?.startsWith("comeback.")
                ? await readers.readComeback(tx, owner, profile)
                : undefined,
            hotItem: command?.startsWith("hot.item.")
                ? await readers.readHotItems(tx, owner, now)
                : undefined,
            heroScore: readers.heroScoreReader(tx, owner, session.alliance),
            profile,
            resource,
            cosmeticTarget: command === "trigger.activity" || command === "avatar.activate"
                ? (session.cosmeticTarget = await readers.readCosmeticTarget(
                    tx,
                    request,
                    command === "avatar.activate" ? owner : undefined,
                ))
                : undefined,
            trouble: command === "get.trouble.list" || command?.startsWith("trouble.")
                ? await readers.readTrouble(tx, owner, command === "get.trouble.list")
                : undefined,
            olympic: command?.startsWith("Olympic.")
                ? await readers.readOlympic(tx, owner)
                : undefined,
            cupBetting: command?.startsWith("euro.cup.")
                ? await readers.readCupBetting(tx, owner)
                : undefined,
            groupBuy: command?.startsWith("groupbuys.")
                ? await readers.readGroupBuy(tx, owner)
                : undefined,
            continuedCost: command?.startsWith("continuedcost.")
                ? readers.readContinuedCost(tx, owner)
                : undefined,
            prayer: await readers.readPrayer(tx, owner),
            recallTask: await readers.readRecallTasks(
                tx,
                owner,
                command?.startsWith("recall.task.") ?? false,
            ),
            regionalRecall: command?.startsWith("region.recall.")
                ? await readers.readRegionalRecall(
                    tx,
                    owner,
                    num(profile, "serverId"),
                    command === "region.recall.init",
                )
                : undefined,
            allianceHeart: command === "heart.send" || command === "heart.init"
                ? await readers.readAllianceHeart(tx, owner, command, request)
                : undefined,
            playerItemGifts: command === "item.send" || command === "gift.init"
                ? await readers.readPlayerItemGifts(tx, owner, command, request)
                : undefined,
            monsterExchange: command === "act.exchange" || command?.startsWith("act.ex.")
                ? await readers.readMonsterExchanges(tx, owner)
                : undefined,
            fragmentExchange: command === "act.exchange" || command?.startsWith("act.ex.")
                ? await readers.readFragmentExchanges(tx, owner)
                : undefined,
            seasonalExchange: command?.startsWith("activity.exchange.")
                ? await readers.readSeasonalExchange(tx, owner)
                : undefined,
            vipBox: command?.startsWith("vip.box.")
                ? await readers.readVipBox(tx, owner)
                : undefined,
            targetTask: await readers.readTargetTasks(tx, owner),
            rechargeFeedback: command === "pay.recharge.ui.state" || command === "feedback.paid"
                ? readers.rechargeFeedbackReader(tx, owner)
                : undefined,
            eggActivity: command?.startsWith("egg.")
                ? await readers.readEggActivity(tx, owner)
                : undefined,
            goldEggs: command?.startsWith("goldeggs.")
                ? readers.goldEggsReader(tx, owner, num(profile, "serverId"), now)
                : undefined,
            normalRecharge: command?.startsWith("normal.recharge.")
                ? await readers.readNormalRecharge(tx, owner, now, true)
                : undefined,
            rechargeActivity: command?.startsWith("new.sercum.")
                ? await readers.readRechargeActivity(tx, owner)
                : undefined,
            ordinaryBoxServer: command === "get.table.value" || command?.startsWith("ordinary.box.")
                ? await readers.readOrdinaryBoxServer(tx)
                : undefined,
            sevenDayCycle: command?.startsWith("sevenday.")
                ? await readers.readSevenDayCycle(tx, owner)
                : undefined,
            branchCity: command?.startsWith("branchcity.")
                ? ((
                    await tx
                        .select()
                        .from(user_branch_city_info)
                        .where(eq(user_branch_city_info.uid, owner))
                )[0] ?? null)
                : undefined,
            dailyInvestment: command?.startsWith("invest.")
                ? await readers.readDailyInvestment(tx, owner)
                : undefined,
            castleLevelEvent: command?.startsWith("castle.")
                ? await readers.readCastleLevelEvent(tx, owner)
                : undefined,
            luckyDay: command?.startsWith("luckyday.")
                ? await readers.readLuckyDay(tx, owner)
                : undefined,
            dragonTower: command?.startsWith("dragontower")
                ? await readers.readDragonTower(tx, owner, now, num(profile, "serverId"), request)
                : undefined,
            expedition: await readers.readExpedition(tx, profile, now, command, request),
            expeditionScore: { load: (at) => readers.readExpedition(tx, profile, at) },
            arena: command?.startsWith("arena.") || command === "show.arena.army"
                ? await readers.readArena(tx, owner)
                : undefined,
            anniversaryStatistics: command === "1year.info"
                ? await readers.readAnniversaryStatistics(tx, owner)
                : undefined,
            campaignVariables: await readers.readCampaignVariables(
                tx,
                owner,
                Number(profile.serverId),
            ),
            lottery: command?.startsWith("lottery.")
                ? await readers.readLottery(tx, owner)
                : undefined,
            totems: ["totem", "totem.init"].includes(command ?? "")
                ? await readers.readTotems(tx, owner)
                : undefined,
            civilizationSciences,
            ...(command === "civilizationCastle"
                ? await readers.readCivilizationCastle(tx, owner, request)
                : {}),
            worldMutation,
            dragons: await readers.readDragonProgression(tx, owner),
            minstrel: ["minstrel", "alchemist"].includes(command ?? "")
                ? (
                    await tx
                        .select()
                        .from(activity_minstrel)
                        .where(
                            and(
                                eq(activity_minstrel.uid, owner),
                                eq(activity_minstrel.type, command === "alchemist" ? 1 : 0),
                            ),
                        )
                )[0]
                : undefined,
            generalRoster: await readers.readGeneralRoster(tx, owner, command, ranking),
            abilityPages: await readers.readAbilityPages(tx, owner),
            suitDecompositions: await session.equipment.readSuitDecompositions(),
            quests,
            statistics: statistics ?? {},
            buildingExperience: buildingExperience ?? {},
            buildings,
            sciences,
            armies,
            hospital,
            forts,
            queues,
            effects: await readers.readProgressionEffects(
                tx,
                owner,
                await readers.readPlayerEffects(tx, profile, true),
            ),
            newGenerals: await readers.readResourceNewGenerals(tx, owner, false),
            tasks,
            skills,
            achievements,
            equipment,
            glory: glory ?? {},
        };
    };
}
