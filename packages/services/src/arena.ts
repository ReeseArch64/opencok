import { createHash, randomUUID } from "node:crypto";
import { encode, decode, sfs, str, int, Type, type Fields } from "@opencok/messages/sfs";
import { num, text, type Row } from "@opencok/contracts/rows";
import type {
  ArenaApplication,
  ArenaBattleGateway,
  ArenaResult,
  ArenaWrite,
} from "@opencok/contracts/arena";
import { arenaArmySelection, arenaFailure, arenaRankDelta } from "@opencok/rules/arena";
import { cityInteger } from "@opencok/rules/city-progression";
import { serverFeature } from "@opencok/rules/power-context";
import { arenaInfo, arenaArmy } from "@opencok/mappings/arena";
import type { CityDomain } from "./city-progression";

export function createArenaDomain(gateway?: ArenaBattleGateway): CityDomain {
  return {
    commands: [
      "arena.info",
      "arena.apply",
      "arena.army",
      "show.arena.army",
      "arena.enter",
      "arena.leave",
      "arena.matched",
      "arena.finished",
    ],
    types: [],
    async prepare(context, command, params) {
      const saved = context.state.arena;
      if (!saved) arenaFailure();
      const castle = context.state.buildings.reduce(
        (level, row) =>
          num(row, "itemId") === 400000
            ? Math.max(level, num(row, "level") + num(row, "star"))
            : level,
        0,
      );
      const row: Row = {
        uid: context.owner,
        rankScore: Math.trunc(castle * 0.1),
        state: 0,
        fightServerId: 0,
        worldId: 0,
        version: 0,
        time: 0n,
        totalWinCount: 0,
        totalLoseCount: 0,
        serialWinCount: 0,
        applicationId: "",
        ...saved.legacy,
        ...saved.registration,
      };
      if (!saved.registration && num(row, "state") > 0)
        row.applicationId = createHash("sha256")
          .update(
            [context.owner, String(row.time), String(row.worldId), String(row.version)].join(":"),
          )
          .digest("hex")
          .slice(0, 32);
      const armies = saved.armies.map((row) => ({ ...row }));
      const write: ArenaWrite = (context.write.arena = { registration: row });
      const notification = () =>
        encode({ owner: sfs.string(context.owner), info: sfs.object(arenaInfo(row)) });
      if (command === "arena.info") return { response: encode(arenaInfo(row)), event: null };
      if (command === "show.arena.army")
        return { response: encode(arenaArmy(armies)), event: null };
      if (command === "arena.army") {
        if (!saved.world || num(saved.world, "worldId") !== 0 || num(row, "state") === 3)
          arenaFailure();
        const selection = arenaArmySelection(
          context.rules,
          str(params, "armies"),
          armies.map((row) => ({ armyId: text(row, "armyId"), count: num(row, "free") })),
        );
        write.armies = selection.map((unit) => ({
          uid: context.owner,
          armyId: unit.armyId,
          free: unit.count,
        }));
        return { response: encode({}), event: null };
      }
      if (!gateway?.validated()) arenaFailure();
      if (command === "arena.apply") {
        if (
          !serverFeature(context.rules, "fight_arena", {
            kingdomId: context.rules.kingdomId,
            version: "12.06.0",
            now: Number(context.now),
          }) ||
          castle < cityInteger(context.rules.items.get("fight_arena")?.k5, 1) ||
          !saved.world ||
          num(saved.world, "worldId") !== 0 ||
          num(row, "state") !== 0
        )
          arenaFailure();
        row.state = 1;
        row.time = context.now;
        row.applicationId = randomUUID().replaceAll("-", "");
        return {
          response: encode(arenaInfo(row)),
          event: encode({
            owner: sfs.string(context.owner),
            applicationId: sfs.string(text(row, "applicationId")),
            rankScore: sfs.int(num(row, "rankScore")),
            registeredAt: sfs.long(context.now),
          }),
        };
      }
      const applicationId = str(params, "applicationId", text(row, "applicationId"));
      if (!applicationId || applicationId !== text(row, "applicationId")) arenaFailure();
      if (command === "arena.matched") {
        const worldId = cityInteger(int(params, "worldId"), 1),
          fightServerId = cityInteger(int(params, "fightServerId"), 1),
          version = cityInteger(int(params, "version"), 1);
        if (
          [2, 3].includes(num(row, "state")) &&
          num(row, "worldId") === worldId &&
          num(row, "version") === version &&
          num(row, "fightServerId") === fightServerId
        )
          return { response: encode(arenaInfo(row)), event: null };
        if (num(row, "state") !== 1) arenaFailure();
        Object.assign(row, { worldId, fightServerId, version, state: 2 });
        return { response: encode(arenaInfo(row)), event: notification() };
      }
      if (command === "arena.enter") {
        if (
          ![2, 3].includes(num(row, "state")) ||
          !saved.world ||
          num(saved.world, "worldId") !== 0 ||
          !armies.some((unit) => num(unit, "free") > 0)
        )
          arenaFailure();
        const result = await gateway.enter({
          owner: context.owner,
          applicationId,
          worldId: num(row, "worldId"),
          version: num(row, "version"),
          fightServerId: num(row, "fightServerId"),
          armies: armies.map((unit) => ({
            armyId: text(unit, "armyId"),
            count: num(unit, "free"),
          })),
        });
        if (
          result.uid !== context.owner ||
          !Object.keys(result.serverInfo).length ||
          Object.values(result.serverInfo).some((value) => typeof value !== "string")
        )
          arenaFailure();
        row.state = 3;
        return {
          response: encode({
            serverInfo: sfs.object(
              Object.fromEntries(
                Object.entries(result.serverInfo).map(([key, value]) => [key, sfs.string(value)]),
              ),
            ),
            uid: sfs.string(context.owner),
          }),
          event: notification(),
        };
      }
      if (command === "arena.leave") {
        if (
          num(row, "state") !== 3 ||
          !saved.world ||
          num(saved.world, "worldId") !== num(row, "worldId")
        )
          arenaFailure();
        await gateway.leave({
          owner: context.owner,
          applicationId,
          worldId: num(row, "worldId"),
          version: num(row, "version"),
        });
        row.state = 0;
        return { response: encode({}), event: notification() };
      }
      if (command === "arena.finished") {
        if (
          ![2, 3].includes(num(row, "state")) ||
          int(params, "worldId") !== num(row, "worldId") ||
          int(params, "version") !== num(row, "version") ||
          params.won?.type !== Type.Bool
        )
          arenaFailure();
        const result: ArenaResult = {
          owner: context.owner,
          applicationId,
          worldId: num(row, "worldId"),
          version: num(row, "version"),
          won: params.won.value as boolean,
          playerScore: cityInteger(int(params, "playerScore")),
          teamTotal: cityInteger(int(params, "teamTotal")),
          resultId: str(params, "resultId"),
        };
        if (
          !result.resultId ||
          result.resultId.length > 128 ||
          !(await gateway.acceptResult(result))
        )
          arenaFailure();
        row.rankScore = cityInteger(
          num(row, "rankScore") + arenaRankDelta(result.playerScore, result.teamTotal, result.won),
        );
        if (result.won) {
          row.totalWinCount = cityInteger(num(row, "totalWinCount") + 1);
          row.serialWinCount = cityInteger(num(row, "serialWinCount") + 1);
        } else {
          row.totalLoseCount = cityInteger(num(row, "totalLoseCount") + 1);
          row.serialWinCount = 0;
        }
        row.state = 0;
        return { response: encode(arenaInfo(row)), event: notification() };
      }
      return arenaFailure();
    },
    async apply() {
      arenaFailure();
    },
  };
}
export async function publishArenaMutation(
  payload: Buffer,
  command: string,
  gateway: ArenaBattleGateway | undefined,
  publish: (owner: string, command: string, body: Fields) => Promise<unknown>,
) {
  const body = decode(payload),
    owner = str(body, "owner");
  if (command === "arena.apply") {
    if (!gateway?.validated()) arenaFailure();
    const application: ArenaApplication = {
      owner,
      applicationId: str(body, "applicationId"),
      rankScore: int(body, "rankScore"),
      registeredAt: BigInt(body.registeredAt!.value as bigint),
    };
    await gateway.enqueue(application);
    return;
  }
  if (body.info?.type !== Type.Object) arenaFailure();
  await publish(owner, "push.arena.state", body.info.value as Fields);
}
