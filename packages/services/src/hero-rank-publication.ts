import type {
  HeroRankCursor,
  HeroRankProjection,
  HeroRankSource,
  HeroRankScore,
  HeroRankVersionedScore,
} from "@opencok/contracts/hero-rank-publication";
import { heroRankingLookup } from "@opencok/rules/hero-ranking";
import { cityInteger } from "@opencok/rules/city-progression";
import { long, num, text } from "@opencok/contracts/rows";
import type { Rules } from "@opencok/rules/game";

export class HeroRankPublicationService {
  private cursor?: HeroRankCursor;
  private running?: Promise<void>;

  constructor(
    readonly source: HeroRankSource,
    readonly projection: HeroRankProjection,
    readonly publish: (rows: readonly HeroRankVersionedScore[]) => Promise<void>,
    readonly rules: Rules,
    readonly now = Date.now,
  ) {}

  refresh() {
    this.running ??= this.run().finally(() => {
      this.running = undefined;
    });

    return this.running;
  }

  private async run() {
    for (let page = 0; page < 4; page++) {
      const at = BigInt(this.now()),
        rows = await this.source.page(this.cursor, at),
        scores: HeroRankScore[] = [];

      for (const row of rows) {
        const type = cityInteger(row.event.type, 1, 4),
          member = text(row.score, "uid"),
          alliance = type === 2 || type === 4;

        if (
          type >= 3 &&
          !text(row.event, "serverGroup").split("|").includes(String(this.rules.kingdomId))
        )
          continue;

        const lookup = heroRankingLookup(
            row.event,
            alliance ? "" : member,
            alliance ? member : "",
            this.rules,
            this.rules.kingdomId,
            "12.06.0",
          ),
          level = cityInteger(row.score.level, 0, 4095);

        if (typeof lookup === "number") continue;

        const rankKey = lookup.keys[level];

        if (!rankKey) throw new Error("Invalid hero rank publication band");

        scores.push({
          rankKey,
          member,
          kingdomId: this.rules.kingdomId,
          actId: text(row.event, "uuid"),
          eventId: text(row.event, "eventId"),
          type,
          level,
          endTime: long(row.event, "endTime"),
          score: num(row.score, "score"),
          metadata: row.metadata,
        });
      }

      if (scores.length) await this.publish(await this.projection.write(scores, at));

      const last = rows.at(-1);
      this.cursor =
        rows.length === 64 && last
          ? { actId: text(last.event, "uuid"), member: text(last.score, "uid") }
          : undefined;

      if (!this.cursor) break;
    }
  }
}
