import { sfs, encode, str } from "@opencok/messages/sfs";
import { num, text, long } from "@opencok/contracts/rows";
import {
  expeditionAwardId,
  expeditionAwardOperation,
  expeditionStagePrizes,
} from "@opencok/rules/expedition-stage-rewards";
import { expeditionOpen } from "@opencok/rules/new-expedition";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { mailRewardEntries } from "@opencok/rules/mail-rewards";
import {
  expeditionHistory,
  expeditionHistorySnapshot,
} from "@opencok/mappings/expedition-stage-rewards";
import { expeditionScoreText } from "@opencok/mappings/new-expedition";
import { avatarMailPush } from "@opencok/mappings/avatar-mail";
import { pinProgressionReward } from "./progression-rewards";
import type {
  ExpeditionAwardStore,
  ExpeditionAwardStandings,
  ExpeditionAwardPayload,
  ExpeditionAwardMail,
  ExpeditionHistorySource,
} from "@opencok/contracts/expedition-stage-rewards";
import type { AvatarSystemMail } from "@opencok/contracts/files";
import type { Rules } from "@opencok/rules/game";
import type { CityDomain } from "./city-progression";

export class ExpeditionStageRewardService {
  private running?: Promise<void>;
  private start = 0;

  constructor(
    readonly store: ExpeditionAwardStore,
    readonly standings: ExpeditionAwardStandings,
    readonly rules: Rules,
    readonly deliver: (owner: string, id: string) => Promise<unknown>,
    readonly now = Date.now,
  ) {}

  refresh() {
    this.running ??= this.run().finally(() => {
      this.running = undefined;
    });

    return this.running;
  }

  private async admit(at: bigint) {
    const closures = await this.store.candidates(),
      begin = this.start;
    let work = 0;

    for (let offset = 0; offset < closures.length && work < 64; offset++) {
      const index = (begin + offset) % closures.length,
        closure = closures[index]!,
        members = await this.store.page(closure);
      this.start = (index + 1) % closures.length;
      const shared = await this.standings.read(
        closure,
        members.map((row) => text(row, "uid")),
      );

      if (!shared) continue;

      const history = closure.history
        ? text(closure, "history")
        : expeditionHistorySnapshot(shared.result);

      if (!members.length) {
        await this.store.finished(closure, history);
        continue;
      }

      for (const member of members) {
        let count = 1;
        await this.store.plan(
          closure,
          member,
          () => {
            const uid = text(member, "uid"),
              { plans, claims } = expeditionStagePrizes(
                closure,
                member,
                shared.members.find((row) => row.member === uid),
                this.rules,
              ),
              stage = num(closure, "stage"),
              periodId = text(closure, "periodId");
            const ranking: unknown = JSON.parse(text(shared.result, "ranking"));

            if (
              !ranking ||
              typeof ranking !== "object" ||
              !("totals" in ranking) ||
              !Array.isArray(ranking.totals)
            )
              throw new Error("Missing final expedition totals");

            const total = ranking.totals.find(
              (row) => row.serverId === this.rules.kingdomId,
            )?.score;

            if (typeof total !== "number" || !Number.isFinite(total) || total < 0)
              throw new Error("Invalid final expedition total");

            const won = num(closure, "winner") === this.rules.kingdomId,
              parameters = [String(stage), expeditionScoreText(total)],
              threshold = this.rules.items.get("17_wk")?.k2 ?? "";

            if (won) parameters.push(threshold);

            const top = shared.top;

            if (top?.metadata && (!won || num(top, "score") >= Number(threshold))) {
              const metadata: unknown = JSON.parse(text(top, "metadata"));

              if (
                metadata &&
                typeof metadata === "object" &&
                "name" in metadata &&
                typeof metadata.name === "string"
              )
                parameters.push(metadata.name, expeditionScoreText(num(top, "score")));
            }

            plans.push({
              kind: "summary",
              reward: "0",
              template: won ? "12058" : "12059",
              parameters,
            });
            const mails: ExpeditionAwardMail[] = plans.map((plan) => {
              const template = this.rules.mail.get(plan.template),
                contents = javaMailBytes(
                  template?.message
                    ? `${template.message}${plan.parameters.length ? "|" + plan.parameters.join("|") : ""}`
                    : undefined,
                );

              if (!template || !contents) throw new Error("Missing expedition award mail template");

              const reward =
                plan.reward === "0"
                  ? null
                  : pinProgressionReward({ rules: this.rules, now: at }, plan.reward);

              if (reward !== null) mailRewardEntries(reward);

              return {
                id: expeditionAwardId(periodId, stage, uid, plan.kind),
                sender: template.sender ?? "",
                title: template.title ?? "",
                contents: Buffer.from(contents).toString("base64"),
                reward,
              };
            });
            count = Math.max(1, mails.length);

            return { mails, claims };
          },
          history,
          at,
        );
        closure.awardCursor = text(member, "uid");
        work += count;

        if (work >= 64) break;
      }
    }
  }

  private async run() {
    const at = BigInt(this.now());
    let failed = false,
      failure: unknown;

    try {
      await this.admit(at);
    } catch (error) {
      failed = true;
      failure = error;
    }

    for (const award of await this.store.pending(at)) {
      try {
        await this.deliver(text(award, "ownerUid"), text(award, "id"));
      } catch {
        await this.store.defer(text(award, "id"), BigInt(this.now()));
      }
    }

    if (failed) throw failure;
  }
}

function payload(value: string): ExpeditionAwardPayload {
  const parsed: unknown = JSON.parse(value);

  if (
    !parsed ||
    typeof parsed !== "object" ||
    !("mails" in parsed) ||
    !("claims" in parsed) ||
    !Array.isArray(parsed.mails) ||
    !Array.isArray(parsed.claims) ||
    parsed.mails.length > 129 ||
    parsed.claims.length > 128 ||
    parsed.claims.some((id) => !Number.isSafeInteger(id) || id < 1)
  )
    throw new Error("Invalid expedition award payload");

  const ids = new Set<string>();

  for (const mail of parsed.mails) {
    if (
      !mail ||
      typeof mail !== "object" ||
      typeof mail.id !== "string" ||
      !/^[a-f0-9]{32}$/.test(mail.id) ||
      ids.has(mail.id) ||
      typeof mail.sender !== "string" ||
      typeof mail.title !== "string" ||
      typeof mail.contents !== "string" ||
      Buffer.from(mail.contents, "base64").toString("base64") !== mail.contents ||
      (mail.reward !== null && typeof mail.reward !== "string")
    )
      throw new Error("Invalid expedition award mail");

    ids.add(mail.id);
  }

  return parsed as ExpeditionAwardPayload;
}

export const expeditionStageRewardDomain: CityDomain = {
  commands: ["expedition.award.deliver"],
  types: [],
  async prepare(context, _command, params) {
    const id = str(params, "awardId");

    if (!/^[a-f0-9]{32}$/.test(id) || str(params, "operationId") !== expeditionAwardOperation(id))
      throw new Error("Invalid expedition delivery operation");

    const award = await context.state.expeditionAward?.load(id);

    if (
      !award ||
      award.ownerUid !== context.owner ||
      long(award, "createdAt") > context.now ||
      id !== expeditionAwardId(text(award, "periodId"), num(award, "stage"), context.owner)
    )
      throw new Error("Missing owned expedition entitlement");

    if (long(award, "deliveredAt") > 0n) return { response: encode({}), event: null };

    const saved = payload(text(award, "payload"));

    if (!context.economy.event) throw new Error("Expedition mail publication unavailable");

    const quests = (context.write.quests ??= {}),
      full = context.rules.items.get("chat_switch")?.k3?.split("|").includes("1") ?? false;

    for (const draft of saved.mails) {
      if (draft.reward !== null) mailRewardEntries(draft.reward);

      const mail: AvatarSystemMail = {
        uid: draft.id + "00",
        owner: context.owner,
        fromName: draft.sender,
        title: draft.title,
        type: 2,
        contents: Buffer.from(draft.contents, "base64"),
        extra: null,
        rewardId: draft.reward,
        rewardStatus: draft.reward === null ? 1 : 0,
        reply: 0,
        createTime: context.now,
      };
      quests.mail = [...(quests.mail ?? []), mail];
      context.economy.event({
        id: draft.id,
        type: "expedition.award.mail",
        payload: encode({
          owner: sfs.string(context.owner),
          mail: sfs.object(avatarMailPush(mail, full)),
        }),
      });
    }

    context.write.expeditionAward = id;

    return { response: encode({}), event: null };
  },
  async apply() {
    throw new Error("Unsupported expedition reward activity");
  },
};

export class ExpeditionHistoryService {
  constructor(
    readonly source: ExpeditionHistorySource,
    readonly rules: Rules,
    readonly now = Date.now,
  ) {}

  async read(owner: string) {
    const at = BigInt(this.now());

    if (!expeditionOpen(this.rules, at)) throw new Error("Expedition history is unavailable");

    const rows = await this.source.owned(owner, at),
      ids = [
        ...new Set(
          rows
            .flatMap((row) => [num(row, "winServerId"), num(row, "loseServerId")])
            .filter((id) => id > 0),
        ),
      ];

    return expeditionHistory(rows, await this.source.servers(ids));
  }
}
