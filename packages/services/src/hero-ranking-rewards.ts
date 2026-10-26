import { sfs, encode, str } from "@opencok/messages/sfs";
import { long, num, text } from "@opencok/contracts/rows";
import {
  heroRankAwardIdentity,
  heroRankAwardOperation,
  heroRankPrize,
} from "@opencok/rules/hero-ranking-rewards";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { avatarMailPush } from "@opencok/mappings/avatar-mail";
import { mailRewardEntries } from "@opencok/rules/mail-rewards";
import { pinProgressionReward } from "./progression-rewards";
import type {
  HeroRankRewardStore,
  HeroRankRewardStandings,
} from "@opencok/contracts/hero-ranking-rewards";
import type { AvatarSystemMail } from "@opencok/contracts/files";
import type { Rules } from "@opencok/rules/game";
import type { CityDomain } from "./city-progression";
export class HeroRankingRewardService {
  private running?: Promise<void>;
  private start = 0;
  constructor(
    readonly store: HeroRankRewardStore,
    readonly standings: HeroRankRewardStandings,
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
        rows = await this.standings.page(closure);
      this.start = (index + 1) % closures.length;
      if (!rows) continue;
      if (!rows.length) {
        await this.store.finished(closure);
        continue;
      }
      for (const standing of rows) {
        const prize = heroRankPrize(
            { type: closure.type!, eventId: closure.eventId! },
            standing,
            this.rules,
          ),
          member = text(standing, "member");
        const count = await this.store.plan(
          closure,
          standing,
          prize
            ? (owners) => {
                const template = this.rules.mail.get(prize.template),
                  contents = javaMailBytes(
                    template?.message ? `${template.message}|${num(standing, "rank")}` : undefined,
                  );
                if (!template || !contents) throw new Error("Missing hero ranking reward template");
                return owners.map((ownerUid) => ({
                  id: heroRankAwardIdentity(text(closure, "periodId"), member, ownerUid),
                  ownerUid,
                  sender: template.sender ?? "",
                  title: template.title ?? "",
                  contents,
                  rewardId: prize.rewardId,
                  pinnedReward:
                    prize.rewardId && prize.rewardId !== "0"
                      ? pinProgressionReward({ rules: this.rules, now: at }, prize.rewardId)
                      : null,
                }));
              }
            : undefined,
          at,
        );
        closure.awardCursor = member;
        work += Math.max(1, count);
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
export const heroRankingRewardDomain: CityDomain = {
  commands: ["hero.rank.deliver"],
  types: [],
  async prepare(context, _command, params) {
    const id = str(params, "awardId");
    if (!/^[a-f0-9]{32}$/.test(id) || str(params, "operationId") !== heroRankAwardOperation(id))
      throw new Error("Invalid hero ranking delivery operation");
    const saved = await context.state.heroRankingAward?.load(id);
    if (
      !saved ||
      saved.award.ownerUid !== context.owner ||
      long(saved.award, "createdAt") > context.now
    )
      throw new Error("Missing owned hero ranking entitlement");
    const award = saved.award;
    if (long(award, "deliveredAt") > 0n) return { response: encode({}), event: null };
    context.write.heroRankingAward = { id };
    if (saved.recorded) return { response: encode({}), event: null };
    const reward = award.pinnedReward === null ? null : text(award, "pinnedReward");
    if (reward !== null) mailRewardEntries(reward);
    const mail: AvatarSystemMail = {
      uid: id + "00",
      owner: context.owner,
      fromName: text(award, "sender"),
      title: text(award, "title"),
      type: 2,
      contents: award.contents as Buffer,
      extra: null,
      rewardId: reward,
      rewardStatus: reward === null ? 1 : 0,
      reply: 0,
      createTime: context.now,
    };
    const quests = (context.write.quests ??= {});
    quests.mail = [...(quests.mail ?? []), mail];
    if (award.rewardId !== null)
      context.write.heroRankingAward.history = {
        uid: context.owner,
        allianceId: award.member!,
        eventId: award.actId!,
        rank: award.rank!,
        level: award.level!,
        rewardId: award.rewardId!,
        time: context.now,
      };
    if (!context.economy.event) throw new Error("Hero ranking mail publication unavailable");
    const full = context.rules.items.get("chat_switch")?.k3?.split("|").includes("1") ?? false;
    context.economy.event({
      id: "hero-rank-mail",
      type: "hero.rank.mail",
      payload: encode({
        owner: sfs.string(context.owner),
        mail: sfs.object(avatarMailPush(mail, full)),
      }),
    });
    return { response: encode({}), event: null };
  },
  async apply() {
    throw new Error("Unsupported hero ranking reward activity");
  },
};
