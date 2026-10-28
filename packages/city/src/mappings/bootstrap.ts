import { equipment as equipmentFields } from "@opencok/mappings/equipment";
import { serverClock } from "@opencok/mappings/bootstrap";
import type { ReconnectProgressState, ReconnectProgressWrite } from "@opencok/contracts/reconnect";
import type {
    CityBootstrapContributions,
    CityBootstrapPresentation,
} from "../contracts/bootstrap-projection";
import type { ReadyCity } from "@opencok/contracts/city-bootstrap";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import { building, gold, queue, user } from "@opencok/mappings/city";
import { researchData } from "@opencok/mappings/research";
import { resource } from "@opencok/economy/mappings/resources";
import { sfs, fields, type Fields } from "@opencok/messages/sfs";
import type { Rules } from "@opencok/rules/game";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

export class CityBootstrapMapper
{
    public constructor(
        private readonly rules: Rules,
        private readonly now: () => number,
        private readonly presentation: CityBootstrapPresentation,
    )
    {}

    public queueFields(q: Row, state: ReadyCity, helped = true, now = this.now()): Fields
    {
        const target = state.buildings.find((b) => text(b, "uuid") === text(q, "itemId"));

        if ([1, 8, 9, 10, 17].includes(num(q, "type")) && text(q, "itemId"))
        {
            return queue(
                q,
                { itemId: sfs.string(text(q, "itemId")), allId: sfs.string(text(q, "itemId")) },
                helped,
            );
        }

        if ([2, 3].includes(num(q, "type")) && text(q, "itemId"))
        {
            return queue(q, { itemId: sfs.string(text(q, "itemId")) }, helped);
        }

        if (num(q, "type") === 6 && text(q, "itemId"))
        {
            return queue(q, { itemId: sfs.string(text(q, "itemId")) }, helped);
        }

        if (num(q, "type") === 11 && text(q, "itemId"))
        {
            const row = state.equipment?.find((row) => row.uuid === q.itemId);

            return queue(
                q,
                row
                    ? {
                        itemId: sfs.string(text(row, "itemId")),
                        cost: sfs.string(text(row, "cost")),
                    }
                    : {},
                helped,
            );
        }

        if (num(q, "type") === 12 && text(q, "itemId"))
        {
            return queue(
                q,
                {
                    itemId: sfs.string(text(q, "itemId").split(";")[0] ?? ""),
                    allId: sfs.string(text(q, "itemId")),
                    para: sfs.int(num(q, "para")),
                },
                helped,
            );
        }

        if (num(q, "type") !== 0 && text(q, "itemId"))
        {
            throw new GameError(errors.unsupported, "queue_kind");
        }

        return queue(q, target ? building(target, this.rules, true, now) : {}, helped);
    }

    public info(state: ReadyCity): Fields
    {
        const now = this.now();

        return {
            building: sfs.array(
                state.buildings.map((b) => sfs.object(building(b, this.rules, false, now))),
            ),
            buildingQueue: sfs.array(
                state.queues
                    .filter((q) => num(q, "type") === 0)
                    .map((q) => sfs.object(this.queueFields(q, state, true, now))),
            ),
            resource: sfs.object(resource(state.resource)),
            gold: sfs.long(gold(state.profile)),
            ...(state.sciences && this.rules.power.sciences?.size
                ? { science: researchData(state.sciences, state.queues, this.rules) }
                : {}),
        };
    }

    public initialWorld(world: Row): Fields
    {
        return {
            m: sfs.array(),
            enemy: sfs.array(),
            point: sfs.int(num(world, "pointId")),
            cityDefValue: sfs.int(num(world, "cityDefValue")),
            gridType: sfs.int(num(world, "gridType")),
            ft: sfs.long(long(world, "fireTime")),
            lastCityDefTime: sfs.long(long(world, "lastCityDefTime")),
            stamina: sfs.int(num(world, "attMonsterStamina")),
            lastStaminaTime: sfs.long(long(world, "lastStaminaTime")),
            resSearchCount: sfs.int(num(world, "resSearchCount")),
            maxSearchCount: sfs.int(Number(this.rules.items.get("shake")?.k10 ?? 0)),
        };
    }

    public initial(state: ReadyCity, world: Row, values: CityBootstrapContributions): Fields
    {
        const {
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
        } = values;

        return {
            playerInfo: sfs.object(playerInfo),
            equip: sfs.array(
                (state.equipment ?? [])
                    .filter((row) => num(row, "on") !== 2)
                    .map((row) => sfs.object(equipmentFields(row))),
            ),
            ...(businessMan ? { businessMan: sfs.object(businessMan) } : {}),
            ...normalRecharge?.body,
            ...comeback?.body,
            ...prayer?.body,
            ...recallTasks?.body,
            ...regionalRecall?.body,
            ...hearts?.body,
            ...gifts?.body,
            ...treasureMaps?.body,
            ...equipment?.body,
            ...(generals?.body.data ? fields(generals.body.data) : {}),
            ...dragons?.body,
            ...dragonTower?.body,
            ...vipBox?.body,
            ...luckyDay?.body,
            ...recharge?.body,
            ...totems?.body,
            ...branchCity?.body,
            ...lottery?.body,
            ...civilization?.body,
            ...alliance?.body,
            ...effects?.body,
            ...quest?.body,
            ...serverClock(this.now(), 0),
            ...this.presentation.features(state.profile),
            ...this.info(state),
            user: sfs.object(
                user(
                    state.profile,
                    this.rules,
                    this.presentation.kingdomId,
                    state.civilizationPrestige,
                ),
            ),
            newAccount: sfs.bool(false),
            queue: sfs.array(
                this.presentation.hasReconnect()
                    ? []
                    : state.queues.map((q) => sfs.object(this.queueFields(q, state))),
            ),
            world: sfs.object(this.initialWorld(world)),
            serverTime: sfs.long(this.now()),
            ...expeditionActivity,
        };
    }

    public reconnected(
        state: ReadyCity,
        progress: ReconnectProgressState,
        world: Row,
        write: ReconnectProgressWrite,
        body: Fields,
        result: Fields,
    ): Fields
    {
        const buildings = progress.buildings.map((row) => {
            const refresh = write.buildingRefreshes.find((entry) => entry.uuid === row.uuid);

            return refresh ? { ...row, refreshTime: refresh.refreshTime } : { ...row };
        });
        const prestige = progress.effects.prestige.find(
            (row) => num(row, "civilizationType") === num(progress.profile, "civilizationType"),
        );

        return {
            ...body,
            ...this.info({
                ...state,
                profile: progress.profile,
                resource: { ...progress.resource, ...write.resource },
                buildings,
                queues: [...progress.queues],
                sciences: [...progress.effects.sciences],
            }),
            ...result,
            user: sfs.object(
                user(
                    progress.profile,
                    this.rules,
                    this.presentation.kingdomId,
                    prestige ? long(prestige, "prestigeValue") : 0n,
                ),
            ),
            world: sfs.object({
                ...this.initialWorld(world),
                m: result.worldMarch!,
            }),
        };
    }
}
