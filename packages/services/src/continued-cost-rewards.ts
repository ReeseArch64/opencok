import { CityCommandDomain } from "./city-command-domain.ts";
import { sfs, encode, str } from "@opencok/messages/sfs";
import { long, num, text } from "@opencok/contracts/rows";
import { costRankingBands } from "@opencok/rules/continued-cost-ranking";
import {
  costRankAwardId,
  costRankAwardOperation,
  costRankMail,
} from "@opencok/rules/continued-cost-rewards";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { avatarMailPush } from "@opencok/mappings/avatar-mail";
import { mailRewardEntries } from "@opencok/rules/mail-rewards";
import { pinProgressionReward } from "./progression-rewards";
import type { CostRankAwardStore } from "@opencok/contracts/continued-cost-rewards";
import type { CostRankingRegistry } from "@opencok/contracts/continued-cost-ranking";
import type { CostFinalityShared } from "@opencok/contracts/continued-cost-finality";
import type { AvatarSystemMail } from "@opencok/contracts/files";
import type { Rules } from "@opencok/rules/game";
import type { CityDomain } from "./city-domain.ts";

export class ContinuedCostRewardService {
  private running?: Promise<void>;
  private start = 0;

  constructor(
    readonly store: CostRankAwardStore,
    readonly registry: Pick<CostRankingRegistry, "get">,
    readonly standings: Pick<CostFinalityShared, "standings">,
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
        id = text(closure, "periodId"),
        period = await this.registry.get(id),
        rows = await this.standings.standings(id);
      this.start = (index + 1) % closures.length;

      if (!period || !rows) continue;

      if (!period.expectedRealms.includes(this.rules.kingdomId))
        throw new Error("Foreign consumption ranking award period");

      const bands = costRankingBands(period.rewards);

      for (
        let position = num(closure, "awardCursor");
        position < rows.length && work < 64;
        position++
      ) {
        const standing = { ...rows[position]!, rank: position + 1 },
          band = bands.find((value) => value.min <= standing.rank && value.max >= standing.rank);
        await this.store.plan(
          closure,
          standing,
          band
            ? () => {
                const template = this.rules.mail.get("12199"),
                  contents = javaMailBytes(
                    template?.message ? `${template.message}|${standing.rank}` : undefined,
                  );

                if (!template || !contents)
                  throw new Error("Missing consumption ranking award mail template");

                const reward =
                  band.reward === "0"
                    ? null
                    : pinProgressionReward({ rules: this.rules, now: at }, band.reward);

                if (reward !== null) mailRewardEntries(reward);

                return {
                  sender: template.sender ?? "",
                  title: template.title ?? "",
                  contents: Buffer.from(contents).toString("base64"),
                  reward,
                };
              }
            : undefined,
          at,
        );
        closure.awardCursor = standing.rank;
        work++;
      }

      if (num(closure, "awardCursor") === rows.length)
        await this.store.finished(closure, rows.length, at);
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

    for (const award of await this.store.pending(at))
      try {
        await this.deliver(text(award, "ownerUid"), text(award, "id"));
      } catch {
        await this.store.defer(text(award, "id"), BigInt(this.now()));
      }

    if (failed) throw failure;
  }
}

export class ContinuedCostRewardDomain extends CityCommandDomain {
  public readonly commands: CityDomain["commands"] = ["continuedcost.rank.deliver"];

  public readonly types: CityDomain["types"] = [];

  public readonly prepare: CityDomain["prepare"] = async (context, _command, params) => {
    const id = str(params, "awardId");

    if (!/^[a-f0-9]{32}$/.test(id) || str(params, "operationId") !== costRankAwardOperation(id))
      throw new Error("Invalid consumption award delivery operation");

    const award = await context.state.costRankAward?.load(id);

    if (
      !award ||
      award.ownerUid !== context.owner ||
      long(award, "createdAt") > context.now ||
      id !== costRankAwardId(text(award, "periodId"), context.owner)
    )
      throw new Error("Missing owned consumption ranking entitlement");

    if (long(award, "deliveredAt") > 0n) return { response: encode({}), event: null };

    const draft = costRankMail(text(award, "payload"));

    if (!context.economy.event) throw new Error("Consumption reward publication unavailable");

    const mail: AvatarSystemMail = {
      uid: id + "00",
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
    const quests = (context.write.quests ??= {});
    quests.mail = [...(quests.mail ?? []), mail];
    const full = context.rules.items.get("chat_switch")?.k3?.split("|").includes("1") ?? false;
    context.economy.event({
      id,
      type: "continuedcost.rank.mail",
      payload: encode({
        owner: sfs.string(context.owner),
        mail: sfs.object(avatarMailPush(mail, full)),
      }),
    });
    context.write.costRankAward = id;

    return { response: encode({}), event: null };
  };

  public readonly apply: CityDomain["apply"] = async () => {
    throw new Error("Unsupported consumption award activity");
  };
}

export const continuedCostRewardDomain: CityDomain = new ContinuedCostRewardDomain();
