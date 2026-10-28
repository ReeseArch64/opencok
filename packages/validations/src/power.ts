import { z } from "zod";
import type {
    PlayerStatisticsResponse,
    PowerInfoResponse,
} from "@opencok/contracts/responses/power";
import { field } from "@opencok/messages/validations/response";

export const playerStatisticsSchema = z.strictObject({
    battleWin: field.int,
    battleLose: field.int,
    attackWin: field.int,
    attackLose: field.int,
    defenseWin: field.int,
    detectNum: field.int,
    armyDead: field.int,
    armyCure: field.int,
    cityDes: field.int,
    armyKill: field.long,
}) satisfies z.ZodType<PlayerStatisticsResponse>;

export const powerInfoSchema = playerStatisticsSchema.extend({
    playerPower: field.int,
    heroPower: field.int,
    buildingPower: field.int,
    sciencePower: field.int,
    civilizationSciencePower: field.int,
    questpower: field.int,
    equipPower: field.int,
    knight_title: field.int,
    sagatower_science: field.int,
    banCount: field.int,
    armyPower: field.long,
    fortPower: field.long,
    petDragonPower: field.long,
    prinessPower: field.long,
    nextUpdateTime: field.long,
    banTime: field.long,
}) satisfies z.ZodType<PowerInfoResponse>;
