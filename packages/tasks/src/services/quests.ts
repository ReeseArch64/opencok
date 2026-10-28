import { ActivityDomain } from "@opencok/base/domain/activity-domain";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { QuestCatalog, QuestContext } from "../contracts/quest";
import type { QuestRuntime } from "../contracts/runtime";
import { QuestPolicy } from "../rules/progression";
import { QuestMapper } from "../mappings/quests";
import { QuestCommand } from "../enums/command";
import { QuestRewards } from "./rewards";
import { QuestProgression } from "./progression";
import { QuestCommands } from "./commands";

export class QuestsDomain<TCatalog extends QuestCatalog, TContext extends QuestContext<TCatalog>>
    extends ActivityDomain<TContext>
{
    public readonly commands = [
        QuestCommand.Initialize,
        QuestCommand.Action,
        QuestCommand.ClaimTask,
        QuestCommand.ClaimStage,
        QuestCommand.StoryInfo,
        QuestCommand.StoryReward,
        QuestCommand.DailyInfo,
        QuestCommand.DailyReward,
        QuestCommand.DailyBoxReward,
        QuestCommand.SignInInfo,
        QuestCommand.SignInReward,
        QuestCommand.FreshSignIn,
        QuestCommand.LegacyDailyList,
        QuestCommand.LegacyDailyReward,
    ];
    public readonly types: readonly number[] = [];
    public readonly prepare: ActivityDomain<TContext>["prepare"];
    public readonly grantRewards: QuestRewards<TCatalog, TContext>["grantRewards"];
    public readonly refreshQuests: QuestProgression<TCatalog, TContext>["refreshQuests"];
    public readonly apply: ActivityDomain<TContext>["apply"] = async () => {
        throw new GameError(errors.invalid, "city_progression");
    };

    public constructor(
        runtime: QuestRuntime<TCatalog, TContext>,
        policy: QuestPolicy<TCatalog>,
        mapper: QuestMapper,
    )
    {
        super();
        const rewards = new QuestRewards(runtime);
        const progression = new QuestProgression(runtime, policy);
        this.prepare = new QuestCommands(runtime, policy, mapper, rewards, progression).prepare;
        this.grantRewards = rewards.grantRewards;
        this.refreshQuests = progression.refreshQuests;
    }
}
