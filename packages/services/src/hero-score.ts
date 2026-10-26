import { createHash, randomUUID } from "node:crypto";
import { sfs, encode, decode, str, int, Type, fields, type Fields } from "@opencok/messages/sfs";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import { heroScoreDelta, heroScoreInteger } from "@opencok/rules/hero-score";
import { heroEventRewards, heroScoreFlags } from "@opencok/rules/hero-event";
import { heroHistoryBand } from "@opencok/rules/hero-ranking";
import { featureRealmEnabled, versionAtLeast } from "@opencok/rules/availability";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { mailRewardEntries } from "@opencok/rules/mail-rewards";
import { heroEventEntry, heroEventInfo } from "@opencok/mappings/hero-event";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import { previewRewards } from "@opencok/rules/rewards";
import { randomInt } from "node:crypto";
import { pinProgressionReward } from "./progression-rewards";
import type { CityDomain, CityProgressionContext } from "./city-progression";
function identity(...values: unknown[]) {
  return createHash("sha256").update(JSON.stringify(values)).digest("hex").slice(0, 32);
}
export function heroTargetOperation(act: string, alliance: string, stage: number, owner: string) {
  return `hero:${identity(act, alliance, stage, owner)}`;
}
export function heroTargetParameters(params: Fields, owner: string): Fields {
  const rewards = fields(params.rewards),
    reward = rewards[owner];
  if (reward?.type !== Type.String) throw new Error("Missing owned hero reward");
  const { recipients: _recipients, rewards: _rewards, ...message } = params;
  return {
    ...message,
    reward,
    operationId: sfs.string(
      heroTargetOperation(
        str(params, "actId"),
        str(params, "aid", ""),
        int(params, "stage"),
        owner,
      ),
    ),
  };
}
export async function deliverHeroTargetBatch(
  payload: Uint8Array,
  deliver: (owner: string, params: Fields) => Promise<unknown>,
) {
  const params = decode(Buffer.from(payload)),
    recipients = params.recipients;
  if (
    recipients?.type !== Type.StringArray ||
    !Array.isArray(recipients.value) ||
    recipients.value.length < 1 ||
    recipients.value.length > 64 ||
    new Set(recipients.value).size !== recipients.value.length ||
    recipients.value.some((owner) => typeof owner !== "string" || !owner || owner.length > 40)
  )
    throw new Error("Invalid hero reward recipients");
  const results = await Promise.allSettled(
    (recipients.value as string[]).map((owner) =>
      deliver(owner, heroTargetParameters(params, owner)),
    ),
  );
  const failures = results.filter(
    (result): result is PromiseRejectedResult => result.status === "rejected",
  );
  if (failures.length)
    throw new AggregateError(
      failures.map((result) => result.reason),
      "Hero reward delivery pending",
    );
}
function enqueueTarget(
  context: CityProgressionContext,
  event: Row,
  alliance: string,
  stage: number,
  rewardId: string,
  members: readonly string[],
) {
  if (!members.length) return;
  const template = context.rules.mail.get(
    num(event, "type") === 4
      ? "11669"
      : num(event, "type") === 3
        ? "11667"
        : alliance
          ? "11649"
          : "11635",
  );
  if (!template || !template.message || !context.economy.event)
    throw new Error("Hero target delivery unavailable");
  for (let offset = 0; offset < members.length; offset += 64) {
    const recipients = members.slice(offset, offset + 64);
    context.economy.event({
      id: identity(event.uuid, alliance, stage, offset),
      type: "hero.target.earned",
      payload: encode({
        eventType: sfs.int(num(event, "type")),
        actId: sfs.string(text(event, "uuid")),
        aid: sfs.string(alliance),
        stage: sfs.int(stage),
        recipients: { type: Type.StringArray, value: [...recipients] },
        rewards: sfs.object(
          Object.fromEntries(
            recipients.map((owner) => [owner, sfs.string(pinProgressionReward(context, rewardId))]),
          ),
        ),
        sender: sfs.string(template.sender ?? ""),
        title: sfs.string(template.title ?? ""),
        message: sfs.string(template.message),
      }),
    });
  }
}
export async function flushHeroScore(context: CityProgressionContext) {
  const actions = context.heroActions.splice(0);
  if (
    !actions.length ||
    !context.state.heroScore ||
    num(context.state.profile, "crossFightSrcServerId") > 0 ||
    num(context.state.profile, "serverId") !== context.rules.kingdomId
  )
    return;
  const alliance = text(context.state.profile, "allianceId"),
    scores = new Map<string, Row>(),
    contributions = new Map<string, Row>();
  for (const at of [...new Set(actions.map((action) => action.at))].toSorted((a, b) =>
    a < b ? -1 : a > b ? 1 : 0,
  )) {
    const snapshot = await context.state.heroScore.load(at);
    for (const event of snapshot.events) {
      const type = num(event, "type"),
        isAlliance = type === 2 || type === 4,
        member = isAlliance ? alliance : context.owner,
        gate = context.rules.items.get("heroactivity_on"),
        keys = type === 1 ? ["k1", "k2"] : type === 2 ? ["k5", "k6"] : ["k9", "k10"];
      if (
        !member ||
        !featureRealmEnabled(gate?.[keys[0]!], context.rules.kingdomId) ||
        !versionAtLeast("12.06.0", gate?.[keys[1]!] ?? "")
      )
        continue;
      if (
        type >= 3 &&
        !text(event, "serverGroup").split("|").includes(String(context.rules.kingdomId))
      )
        continue;
      const delta = heroScoreDelta(
        context.rules,
        event,
        actions.filter((action) => action.at === at),
      );
      if (!delta) continue;
      const key = `${event.uuid}:${member}`,
        prior =
          scores.get(key) ??
          snapshot.scores.find((row) => row.uid === member && row.actId === event.uuid),
        castle = [...(context.write.buildings ?? []), ...context.state.buildings].find(
          (row) => num(row, "itemId") === 400000,
        ),
        power =
          snapshot.alliancePower +
          (context.write.statistics?.power ?? long(context.state.statistics, "power")) -
          long(context.state.statistics, "power"),
        level = prior
          ? num(prior, "level")
          : isAlliance
            ? heroHistoryBand(type, 0, power, context.rules)
            : castle
              ? Math.min(29, num(castle, "level") - 1)
              : -1;
      if (level < 0) continue;
      const row: Row = {
          uid: member,
          actId: text(event, "uuid"),
          level,
          score: 0,
          finishFlag: 0,
          rewardFlag: "",
          ...prior,
        },
        score = heroScoreInteger(BigInt(num(row, "score")) + delta),
        rewards = heroEventRewards(event, level, context.rules),
        flags = new Set(heroScoreFlags(row).split(",").filter(Boolean).map(Number));
      let recipients = [context.owner];
      if (isAlliance) {
        const previous =
            contributions.get(key) ??
            snapshot.contributions.find(
              (row) => row.uid === context.owner && row.actId === event.uuid,
            ),
          contribution: Row = {
            uid: context.owner,
            allianceId: alliance,
            actId: text(event, "uuid"),
            score: heroScoreInteger(BigInt(num(previous ?? {}, "score")) + delta),
          };
        contributions.set(key, contribution);
        const participants = new Set(
          snapshot.contributions
            .filter((row) => row.actId === event.uuid)
            .map((row) => text(row, "uid")),
        );
        participants.add(context.owner);
        recipients = snapshot.members.filter((uid) => participants.has(uid)).toSorted();
      }
      rewards.targets.forEach((target, index) => {
        if (score >= target && !flags.has(index)) {
          enqueueTarget(
            context,
            event,
            isAlliance ? alliance : "",
            index + 1,
            rewards.rewards[index]!,
            recipients,
          );
          flags.add(index);
        }
      });
      row.score = score;
      row.finishFlag = score >= rewards.targets.at(-1)! ? 1 : 0;
      row.rewardFlag = [...flags].toSorted((a, b) => a - b).join(",");
      scores.set(key, row);
      const body = encode({
        id: sfs.string(text(event, "eventId")),
        actId: sfs.string(text(event, "uuid")),
        type: sfs.int(type),
        score: sfs.int(score),
        ...(isAlliance ? { aid: sfs.string(alliance) } : {}),
      });
      context.economy.push?.("push.act.score.obtain", body);
      if (isAlliance && context.economy.event) {
        const members = snapshot.members.filter((uid) => uid !== context.owner);
        for (let offset = 0; offset < members.length; offset += 64)
          context.economy.event({
            id: identity("notify", event.uuid, at.toString(), offset),
            type: "hero.score.notify",
            payload: encode({
              recipients: { type: Type.StringArray, value: members.slice(offset, offset + 64) },
              body: sfs.object(decode(body)),
            }),
          });
      }
    }
  }
  if (scores.size)
    context.write.heroScore = {
      scores: [...scores.values()],
      contributions: [...contributions.values()],
    };
}
export const heroTargetDomain: CityDomain = {
  commands: ["hero.target.deliver"],
  types: [],
  async prepare(context, _command, params: Fields) {
    const act = str(params, "actId"),
      alliance = str(params, "aid", ""),
      stage = int(params, "stage"),
      reward = str(params, "reward"),
      message = str(params, "message");
    if (
      !act ||
      act.length > 40 ||
      alliance.length > 40 ||
      stage < 1 ||
      stage > 128 ||
      !message ||
      str(params, "operationId") !== heroTargetOperation(act, alliance, stage, context.owner)
    )
      throw new Error("Invalid hero target delivery");
    mailRewardEntries(reward);
    const contents = javaMailBytes(`${message}|${stage}`);
    if (!contents) throw new Error("Missing hero target mail");
    const quests = (context.write.quests ??= {});
    quests.mail = [
      ...(quests.mail ?? []),
      {
        uid: randomUUID().replaceAll("-", "") + "00",
        owner: context.owner,
        fromName: str(params, "sender", ""),
        title: str(params, "title", ""),
        type: 2,
        contents,
        extra: null,
        rewardId: reward,
        rewardStatus: 0,
        reply: 0,
        createTime: context.now,
      },
    ];
    const snapshot = await context.state.heroScore?.load(context.now),
      event = snapshot?.events.find((row) => row.uuid === act);
    if (snapshot && event) {
      const eventType = num(event, "type"),
        family = eventType >= 3 ? 3 : eventType,
        entries = snapshot.events
          .filter((row) => row.activityId === event.activityId)
          .map((row) => {
            const allianceEvent = [2, 4].includes(num(row, "type")),
              member = allianceEvent ? text(context.state.profile, "allianceId") : context.owner,
              score = snapshot.scores.find(
                (saved) => saved.uid === member && saved.actId === row.uuid,
              ),
              castle = context.state.buildings.find((row) => num(row, "itemId") === 400000),
              level = score
                ? num(score, "level")
                : allianceEvent
                  ? heroHistoryBand(num(row, "type"), 0, snapshot.alliancePower, context.rules)
                  : Math.min(29, num(castle ?? {}, "level") - 1);
            if (level < 0) return undefined;
            const rewards = heroEventRewards(row, level, context.rules);
            return heroEventEntry(
              row,
              { score: rewards.rule.score ?? "", value: rewards.value, targets: rewards.targets },
              rewards.rewards.map((id) =>
                id === "0"
                  ? sfs.array([])
                  : rewardPreviewArray(
                      previewRewards(
                        id,
                        context.rules,
                        {
                          kingdomId: context.rules.kingdomId,
                          version: "12.06.0",
                          now: Number(context.now),
                        },
                        randomInt,
                      ),
                    ),
              ),
              score,
            );
          })
          .filter((row): row is Fields => !!row);
      context.economy.push?.(
        "push.hero.target.achieved",
        encode({
          ...heroEventInfo(entries, family, []),
          eventType: sfs.int(eventType === 2 || eventType === 4 ? 2 : 1),
        }),
      );
    }
    return { response: encode({}), event: null };
  },
  async apply() {
    throw new Error("Unsupported hero target activity");
  },
};
