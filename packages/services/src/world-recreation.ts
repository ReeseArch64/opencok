import { CityCommandDomain } from "./city-command-domain.ts";
import { worldBirthRules } from "@opencok/rules/world-birth";
import { num, long, text } from "@opencok/contracts/rows";
import { encode } from "@opencok/messages/sfs";
import { cityInteger } from "@opencok/rules/city-progression";
import { worldFootprint, worldMutationFailure } from "@opencok/rules/world-march-runtime";
import { worldCityRecreated } from "@opencok/mappings/world-recreation";
import { cityDefenseMaximum } from "./city-defense";
import {
  recoverWorldMarches,
  relocateWorldMarches,
  worldMarchMutationEvent,
} from "./world-march-runtime";
import type { CityDomain } from "./city-domain.ts";

export const worldRecreationCommands = ["world.user.rcr"];

export class WorldRecreationDomain extends CityCommandDomain {
  public readonly commands: CityDomain["commands"];
  public readonly types: CityDomain["types"];
  public readonly prepare: CityDomain["prepare"];
  public readonly apply: CityDomain["apply"];

  public constructor(size: number) {
    super();

    this.commands = worldRecreationCommands;

    this.types = [];

    this.prepare = async (context, _command, params) => {
      const state = context.state.worldMutation;

      if (!state || num(state.world, "pointId") !== 0) {worldMutationFailure();}

      if (!context.birthPoint) {worldMutationFailure();}

      const placement = await context.birthPoint(worldBirthRules(context.rules)),
        target = cityInteger(placement.point, 1, size * size),
        footprint = worldFootprint(target, size),
        castle = context.state.buildings.find((row) => num(row, "itemId") === 400000);

      if (!castle) {worldMutationFailure();}

      const rows = footprint.map((id) => placement.points.find((row) => num(row, "id") === id));

      if (
        rows.some(
          (row) =>
            !row ||
            num(row, "pointType") !== 0 ||
            num(row, "gridType") !== 2 ||
            num(row, "grid2Type") !== 0 ||
            text(row, "ownerId") ||
            text(row, "ownerMarchUUid") ||
            text(row, "territoryAlliance") ||
            long(row, "reserve") !== 0n,
        )
      )
        {worldMutationFailure();}

      const maximum = cityDefenseMaximum(context),
        shield = context.state.effects.states
          .filter(
            (row) =>
              long(row, "startTime") <= context.now &&
              long(row, "endTime") > context.now &&
              (context.rules.power.statuses?.get(String(row.stateId))?.effect ?? "")
                .split("|")
                .some((pair) => pair.split(";")[0] === "61"),
          )
          .reduce((end, row) => (long(row, "endTime") > end ? long(row, "endTime") : end), 0n);
      recoverWorldMarches(context);
      const write = (context.write.worldMutation ??= {});

      for (const row of rows) {
        const id = num(row!, "id"),
          value = {
            ...row!,
            pointType: id === target ? 1 : 8,
            pointItem: id === target ? null : String(target),
            ownerId: context.owner,
            ownerName: text(context.state.profile, "name"),
            allianceId: text(context.state.profile, "allianceId"),
            ownerMarchUUid: "",
            resLevel: num(castle, "level") + num(castle, "star"),
            resInitValue: 0,
            resCostValue: 0,
            cityDefValue: id === target ? maximum : 0,
            shieldTime: id === target ? shield : 0n,
            startOccupyTime: 0n,
            startTime: 0n,
            fireTime: 0n,
            flushTime: 0n,
            sendHeartDurationTime: 0n,
            heartType: "",
            flushFlag: 0,
          };
        write.points = [...(write.points ?? []).filter((prior) => prior.id !== id), value];
      }

      relocateWorldMarches(context, target);
      write.world = {
        ...state.world,
        pointId: target,
        lastCityDefTime: context.now,
        lastMoveCityTime: context.now,
      };

      return {
        response: encode(
          worldCityRecreated({
            srcPoint: 0,
            dstPoint: target,
            point: target,
            cityDefValue: maximum,
            lastCityDefTime: context.now,
          }),
        ),
        event: encode(worldMarchMutationEvent(context, params)),
      };
    };

    this.apply = async () => {
      worldMutationFailure();
    };
  }
}

export function createWorldRecreationDomain(size: number): CityDomain {
  return new WorldRecreationDomain(size);
}
