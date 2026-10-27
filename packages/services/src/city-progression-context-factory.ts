import { generalDrawPeriod } from "@opencok/hero/rules/general-draws";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { resourceOwnerRuleContext } from "./world-resource-owner-context";
import { resourceGeneralBuildingEffect } from "@opencok/hero/services/general-building-effects";
import type { ActivityEconomy } from "@opencok/contracts/timed-activity";
import type { CityProgressionStore } from "@opencok/contracts/city-progression";
import type { Rules } from "@opencok/rules/game";
import { cityInteger } from "@opencok/rules/city-progression";
import { playerGameEffect } from "@opencok/rules/power-resolver";
import { generalSkillPoints } from "@opencok/hero/services/general-power";
import type { InventoryEffects } from "./inventory";
import { CityProgressionContext } from "./city-progression-context.ts";

export class CityProgressionContextFactory<T> {
  public constructor(
    private readonly store: (tx: T, owner: string, now: bigint) => CityProgressionStore,
    private readonly rules: Rules,
    private readonly effects: InventoryEffects,
  ) {}

  public readonly create = async (
    tx: T,
    owner: string,
    now: bigint,
    economy: ActivityEconomy,
    command?: string,
    request?: Uint8Array,
  ) => {
    const { store, rules, effects } = this;
    const repository = store(tx, owner, now),
      state = await repository.getState(
        command,
        command === "herodraw"
          ? {
              periodStart: generalDrawPeriod(rules, now).start,
              normal: cityInteger(rules.items.get("golden_opentime")?.k11),
              silver: cityInteger(rules.items.get("golden_opentime")?.k12),
              gold: cityInteger(rules.items.get("golden_opentime")?.k13),
            }
          : undefined,
        request,
      );
    const world = await effects.world(),
      emperor = await effects.emperor();
    const abilities = generalSkillPoints(state.effects.generals),
      cache = new Map<number, number>();
    const resolve = (id: number) => {
      let value = cache.get(id);

      if (value === undefined) {
        value = playerGameEffect(
          state.effects,
          rules,
          { kingdomId: rules.kingdomId, version: "12.06.0", now: Number(now) },
          abilities,
          world,
          emperor,
          id as Parameters<typeof playerGameEffect>[6],
        );

        if (!Number.isFinite(value)) {throw new GameError(errors.invalid, "city_progression");}

        cache.set(id, value);
      }

      return value;
    };

    return {
      repository,
      plan: new CityProgressionContext(
        state,
        rules,
        now,
        economy,
        resolve,
        (id, buildingId = 400000, uuid) =>
          resourceGeneralBuildingEffect(
            { effects: state.effects, buildings: state.buildings, newGenerals: state.newGenerals },
            rules,
            { kingdomId: rules.kingdomId, now: Number(now) },
            id,
            resolve,
            () => now,
            buildingId,
            uuid,
          ),
        repository.treasurePoints,
        repository.birthPoint,
        (snapshot, id, at = now) =>
          playerGameEffect(
            snapshot.effects,
            rules,
            resourceOwnerRuleContext(snapshot, { kingdomId: rules.kingdomId, now: Number(at) }),
            generalSkillPoints(snapshot.effects.generals),
            world,
            emperor,
            id as Parameters<typeof playerGameEffect>[6],
          ),
      ),
    };
  };
}
