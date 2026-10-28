import { eq } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { user_branch_city_info } from "@opencok/drizzle/schema/opencok_kingdom/user_branch_city_info";
import type { CityProgressionState } from "@opencok/contracts/city-progression";
import type { CityPersistenceSession } from "../contracts/persistence-session";
import { CityInitializationCommand } from "../enums/initialization-command";

const commands = new Set<string>(Object.values(CityInitializationCommand));

export class CityInitializationReader
{
    public constructor(private readonly session: CityPersistenceSession)
    {}

    public supports(command?: string): boolean
    {
        return command !== undefined && commands.has(command);
    }

    public async getState(command: string): Promise<CityProgressionState>
    {
        if (!this.supports(command))
        {
            throw new Error("Unsupported initialization projection");
        }

        const session = this.session;
        const { tx, owner, now, readers } = session;
        const [city] = await tx.select({
            profile: userprofile,
            resource: user_resource,
            statistics: playerinfo,
        })
            .from(userprofile)
            .innerJoin(user_resource, eq(user_resource.uid, userprofile.uid))
            .leftJoin(playerinfo, eq(playerinfo.uid, userprofile.uid))
            .where(eq(userprofile.uid, owner));

        if (!city)
        {
            throw new Error("Missing city owner");
        }

        const { profile, resource } = city;
        session.alliance = profile.allianceId ?? "";
        const buildings = await session.buildings.read();
        const sciences = await session.research.read();
        const armies = await session.troops.readArmies();
        const equipment = await session.equipment.read();
        const tasks = await session.quests.readTasks();
        const quests = await session.quests.readQuests(profile, now);

        if (buildings.length > 256 || sciences.length > 4096 || armies.length > 1024)
        {
            throw new Error("City aggregate exceeds bound");
        }

        session.questBefore = structuredClone({ tasks, quests });
        const state: Partial<CityProgressionState> = {
            profile,
            resource,
            statistics: city.statistics ?? {},
            buildings,
            sciences,
            armies,
            equipment,
            tasks,
            quests,
        };

        switch (command)
        {
            case CityInitializationCommand.Equipment:
                state.suitDecompositions = await session.equipment.readSuitDecompositions();
                break;
            case CityInitializationCommand.Heart:
                state.allianceHeart = await readers.readAllianceHeart(
                    tx,
                    owner,
                    command,
                    undefined,
                );
                break;
            case CityInitializationCommand.OrdinaryBox:
                break;
            case CityInitializationCommand.Totem:
                state.totems = await readers.readTotems(tx, owner);
                break;
            case CityInitializationCommand.VipBox:
            case CityInitializationCommand.Investment:
            case CityInitializationCommand.Effects:
                state.effects = await readers.readProgressionEffects(
                    tx,
                    owner,
                    await readers.readPlayerEffects(tx, profile, true),
                );

                if (command === CityInitializationCommand.VipBox)
                {
                    state.vipBox = await readers.readVipBox(tx, owner);
                }

                if (command === CityInitializationCommand.Investment)
                {
                    state.dailyInvestment = await readers.readDailyInvestment(tx, owner);
                }
                break;
            case CityInitializationCommand.Egg:
                state.eggActivity = await readers.readEggActivity(tx, owner);
                break;
            case CityInitializationCommand.NormalRecharge:
                state.normalRecharge = await readers.readNormalRecharge(tx, owner, now, true);
                break;
            case CityInitializationCommand.Comeback:
                state.comeback = await readers.readComeback(tx, owner, profile);
                break;
            case CityInitializationCommand.Prayer:
                state.prayer = await readers.readPrayer(tx, owner);
                break;
            case CityInitializationCommand.Recall:
                state.recallTask = await session.recallTasks.readRecallTasks(true);
                break;
            case CityInitializationCommand.Quest:
            case CityInitializationCommand.Civilization:
                state.queues = await tx.select().from(queue).where(eq(queue.ownerId, owner)).limit(
                    257,
                );

                if (state.queues.length > 256)
                {
                    throw new Error("City aggregate exceeds bound");
                }

                if (command === CityInitializationCommand.Civilization)
                {
                    state.civilizationSciences = await session.research.readCivilization();

                    if (state.civilizationSciences.length > 4096)
                    {
                        throw new Error("Civilization science aggregate exceeds bound");
                    }
                }
                break;
            case CityInitializationCommand.Target:
                state.targetTask = await session.targetTasks.readTargetTasks();
                break;
            case CityInitializationCommand.Recharge:
                state.rechargeActivity = await readers.readRechargeActivity(tx, owner);
                break;
            case CityInitializationCommand.Cycle:
                state.sevenDayCycle = await readers.readSevenDayCycle(tx, owner);
                break;
            case CityInitializationCommand.BranchCity:
                state.branchCity = (await tx.select().from(user_branch_city_info)
                    .where(eq(user_branch_city_info.uid, owner)))[0] ?? null;
                break;
            case CityInitializationCommand.Castle:
                state.castleLevelEvent = await readers.readCastleLevelEvent(tx, owner);
                break;
            case CityInitializationCommand.LuckyDay:
                state.luckyDay = await readers.readLuckyDay(tx, owner);
                break;
            case CityInitializationCommand.Lottery:
                state.lottery = await readers.readLottery(tx, owner);
                break;
        }

        return new Proxy(state as CityProgressionState, {
            get(target, key, receiver)
            {
                if (typeof key === "string" && key !== "then" && !Reflect.has(target, key))
                {
                    throw new Error("Unloaded city initialization field");
                }

                return Reflect.get(target, key, receiver);
            },
        });
    }
}
