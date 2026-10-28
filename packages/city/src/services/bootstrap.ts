import type { GameStore } from "@opencok/contracts/game";
import type {
    ReadyCity,
    CityBootstrapResult,
    CityBootstrapHooks,
    CityBootstrapRuntime,
} from "@opencok/contracts/city-bootstrap";
import { long, num } from "@opencok/contracts/rows";
import type { Fields } from "@opencok/messages/sfs";
import { GameError } from "@opencok/errors/game";
import { errors, MOBILE_CLIENT_VERSION } from "@opencok/constants/game";
import type { CityBootstrapServices, CityBootstrapReconnect } from "../contracts/bootstrap";
import type { CityBootstrapMapper } from "../mappings/bootstrap";

export class CityBootstrapService implements CityBootstrapRuntime
{
    public constructor(
        private readonly db: Pick<GameStore, "getCityByPlayerId">,
        private readonly config: { kingdomId: number; },
        private readonly now: () => number,
        private readonly services: CityBootstrapServices,
        private readonly hooks: CityBootstrapHooks,
        private readonly mapper: CityBootstrapMapper,
        private readonly reconnect: CityBootstrapReconnect,
    )
    {}

    public info(state: ReadyCity): Fields
    {
        return this.mapper.info(state);
    }

    public async state(uid: string): Promise<ReadyCity>
    {
        const state = await this.db.getCityByPlayerId(uid, this.now());

        if (!state.profile || !state.resource)
        {
            throw new GameError(errors.missing);
        }

        if (
            long(state.profile, "banTime") > BigInt(this.now())
            || num(state.profile, "banFlag") !== 0
        )
        {
            throw new GameError(errors.invalid);
        }

        return { ...state, profile: state.profile, resource: state.resource };
    }

    public async initialize(
        uid: string,
        correlation: Fields = {},
        signal?: AbortSignal,
    ): Promise<CityBootstrapResult>
    {
        signal?.throwIfAborted();

        const cityProgression = async (owner: string, command: string, params: Fields) => {
            signal?.throwIfAborted();

            const result = await this.services.cityProgression?.(owner, command, params);
            signal?.throwIfAborted();

            return result;
        };
        const businessMan = await this.services.hotItemBusinessMan?.();
        const eggActivity = await cityProgression(uid, "egg.activity.init", {});
        const normalRecharge = await cityProgression(uid, "normal.recharge.init", {});
        const comeback = await cityProgression(uid, "comeback.init", {});
        const prayer = await cityProgression(uid, "prayer.init", {});
        const recallTasks = await cityProgression(uid, "recall.task.init", {});
        const regionalRecall = await cityProgression(uid, "region.recall.init", {});
        const hearts = await cityProgression(uid, "heart.init", {});
        const gifts = await cityProgression(uid, "gift.init", {});
        const worldRecovery = await cityProgression(uid, "world.tick", {});
        const treasureMaps = await cityProgression(uid, "treasuremap.init", {});
        signal?.throwIfAborted();
        await this.services.reconcileAlliance?.(uid);
        signal?.throwIfAborted();
        await this.services.reconcileTimed?.(uid);
        const effects = await cityProgression(uid, "effects.init", {});
        const quest = await cityProgression(uid, "quest.init", {});
        const equipment = await cityProgression(uid, "equipment.init", {});
        const generals = await cityProgression(uid, "general.init", {});
        const dragons = await cityProgression(uid, "dragon.init", {});
        const civilization = await cityProgression(uid, "civilization.science.data.init", {});
        const dragonTower = await cityProgression(uid, "dragontower.init", {});
        const vipBox = await cityProgression(uid, "vip.box.init", {});
        const targets = await cityProgression(uid, "target.init", {});
        const recharge = await cityProgression(uid, "new.sercum.init", {});
        const boxes = await cityProgression(uid, "ordinary.box.init", {});
        const cycle = await cityProgression(uid, "sevenday.init", {});
        const branchCity = await cityProgression(uid, "branchcity.init", {});
        const investment = await cityProgression(uid, "invest.init", {});
        const castleLevel = await cityProgression(uid, "castle.event.init", {});
        const luckyDay = await cityProgression(uid, "luckyday.init", {});
        const campaign = await cityProgression(uid, "campaign.init", {});
        const lottery = await cityProgression(uid, "lottery.init", {});
        const totems = await cityProgression(uid, "totem.init", {});
        const alliance = await this.services.alliance?.(uid, "alliance.init", {});
        signal?.throwIfAborted();
        const state = await this.state(uid);
        const world = state.world;

        if (!world || num(world, "worldId") !== 0 || (state.hasMarches && !this.services.reconnect))
        {
            throw new GameError(errors.unsupported, "world_state");
        }

        const expeditionActivity = await this.services.expeditionActivity?.(uid);
        const playerInfo = await this.hooks.power(uid);
        const body = this.mapper.initial(state, world, {
            playerInfo,
            businessMan,
            expeditionActivity,
            normalRecharge,
            comeback,
            prayer,
            recallTasks,
            regionalRecall,
            hearts,
            gifts,
            treasureMaps,
            equipment,
            dragons,
            dragonTower,
            vipBox,
            luckyDay,
            recharge,
            totems,
            branchCity,
            lottery,
            civilization,
            alliance,
            effects,
            quest,
            generals,
        });
        const initialPushes = [
            eggActivity,
            prayer,
            recallTasks,
            regionalRecall,
            hearts,
            gifts,
            worldRecovery,
            effects,
            quest,
            equipment,
            generals,
            dragons,
            dragonTower,
            vipBox,
            luckyDay,
            castleLevel,
            investment,
            cycle,
            boxes,
            recharge,
            targets,
            civilization,
            campaign,
            lottery,
            totems,
            alliance,
        ].flatMap((result) => result?.pushes ?? []);

        if (this.services.worldEffectBoard)
        {
            initialPushes.push({
                command: "world.effect.push",
                body: await this.services.worldEffectBoard(),
            });
        }

        signal?.throwIfAborted();

        if (!this.services.reconnect)
        {
            return { body, pushes: initialPushes };
        }

        const now = this.now();
        const context = { kingdomId: this.config.kingdomId, version: MOBILE_CLIENT_VERSION, now };

        return this.services.reconnect(uid, now, async (progress) => {
            signal?.throwIfAborted();
            const planned = await this.reconnect.plan(progress, context);

            if (!progress.world || num(progress.world, "worldId") !== 0)
            {
                throw new GameError(errors.unsupported, "world_state");
            }

            planned.result.body = this.mapper.reconnected(
                state,
                progress,
                progress.world,
                planned.write,
                body,
                planned.result.body,
            );
            planned.result.pushes = [...initialPushes, ...planned.result.pushes];

            if (correlation._cok_)
            {
                planned.result.body._cok_ = correlation._cok_;
            }

            this.reconnect.validate(planned.result, "init");

            signal?.throwIfAborted();

            return planned;
        });
    }
}
