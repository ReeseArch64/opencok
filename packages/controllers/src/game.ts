import type { ServerConfig } from "@opencok/contracts/server";
import type { CityState, GameStore } from "@opencok/contracts/game";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { building, gold, queue, resource, user } from "@opencok/dtos/city";
import type { Rules } from "@opencok/rules/game";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import {
  armySnapshot,
  dataConfig,
  featureConfig,
  inventoryItem,
  serverClock,
} from "@opencok/dtos/bootstrap";

type GameConfig = Pick<ServerConfig, "kingdomId">;

type ReadyCity = CityState & { profile: Row; resource: Row };
export interface Result {
  body: Fields;
  pushes: { command: string; body: Fields }[];
}

export class Game {
  constructor(
    readonly db: GameStore,
    readonly rules: Rules,
    readonly config: GameConfig,
    readonly now = Date.now,
  ) {}
  private async state(uid: string): Promise<ReadyCity> {
    const state = await this.db.city(uid, this.now());
    if (!state.profile || !state.resource) throw new GameError(errors.missing);
    if (long(state.profile, "banTime") > BigInt(this.now()) || num(state.profile, "banFlag") !== 0)
      throw new GameError(errors.invalid);
    return { ...state, profile: state.profile, resource: state.resource };
  }
  private queueDto(q: Row, state: ReadyCity, helped = true): Fields {
    const target = state.buildings.find((b) => text(b, "uuid") === text(q, "itemId"));
    if (num(q, "type") !== 0 && text(q, "itemId"))
      throw new GameError(errors.unsupported, "queue_kind");
    return queue(q, target ? building(target, this.rules, true) : {}, helped);
  }
  private info(state: ReadyCity): Fields {
    return {
      building: sfs.array(state.buildings.map((b) => sfs.object(building(b, this.rules)))),
      buildingQueue: sfs.array(
        state.queues
          .filter((q) => num(q, "type") === 0)
          .map((q) => sfs.object(this.queueDto(q, state))),
      ),
      resource: sfs.object(resource(state.resource)),
      gold: sfs.long(gold(state.profile)),
    };
  }
  async initial(uid: string): Promise<Fields> {
    const state = await this.state(uid);
    const world = state.world;
    if (!world || num(world, "worldId") !== 0 || state.hasMarches)
      throw new GameError(errors.unsupported, "world_state");
    return {
      ...serverClock(this.now(), 0),
      ...featureConfig(this.rules),
      ...this.info(state),
      user: sfs.object(user(state.profile, this.rules, this.config.kingdomId)),
      newAccount: sfs.bool(false),
      queue: sfs.array(state.queues.map((q) => sfs.object(this.queueDto(q, state)))),
      world: sfs.object({
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
      }),
      serverTime: sfs.long(this.now()),
    };
  }
  async execute(uid: string, command: string, params: Fields): Promise<Result> {
    let body: Fields;
    switch (command) {
      case "cmd.ping":
        body = { serverNowTime: sfs.long(this.now()) };
        break;
      case "login.dataconfig":
        body = dataConfig(this.rules);
        break;
      case "login.other":
        body = await this.otherLogin(uid, params);
        break;
      case "build.info":
        body = this.info(await this.state(uid));
        break;
      default:
        throw new GameError(errors.unsupported);
    }
    if (params._cok_) body._cok_ = params._cok_;
    if (params.cmdBaseTime) body.cmdBaseTime = params.cmdBaseTime;
    return { body, pushes: [] };
  }
  private async otherLogin(uid: string, params: Fields): Promise<Fields> {
    if (params.config) return featureConfig(this.rules);
    if (params.store) return { store: sfs.array() };
    if (params.exchange) return { exchange: sfs.array(), exchange_gift: sfs.array() };
    const state = await this.state(uid);
    if (params.army)
      return {
        resource: sfs.object(resource(state.resource)),
        army: sfs.array(state.armies.map((r) => sfs.object(armySnapshot(r, this.rules)))),
        items: sfs.array(state.items.map((r) => sfs.object(inventoryItem(r, this.rules)))),
      };
    const lord = state.lord;
    if (!lord) throw new GameError(errors.missing);
    const out: Fields = { medal: sfs.string(text(lord, "medal")) };
    const time = serverClock(this.now(), 0);
    out.nextDay = sfs.long(Number(time.tomorrow!.value) * 1000);
    for (const key of ["levelUp", "pveLevel", "freshRechargeTotal", "castleLevelUp"])
      out[key] = sfs.int(num(lord, key));
    out.remainAttackTime = sfs.int(num(lord, "remainAttackLeaderBossTime"));
    return { lord: sfs.object(out), tomorrow: time.tomorrow! };
  }
}
