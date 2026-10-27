import type {
  ExpeditionScoreCursor,
  ExpeditionScoreSource,
  ExpeditionScoreProjection,
  ExpeditionScoreVersion,
  ExpeditionLiveSource,
} from "@opencok/contracts/expedition-score-publication";
import { type Row } from "@opencok/contracts/rows";
import { sfs, int, type Fields } from "@opencok/messages/sfs";

export class ExpeditionScorePublicationService {
  private cursor?: ExpeditionScoreCursor;
  private running?: Promise<void>;

  constructor(
    readonly source: ExpeditionScoreSource,
    readonly projection: ExpeditionScoreProjection,
    readonly publish: (
      clock: Row,
      version: ExpeditionScoreVersion,
      now: bigint,
    ) => Promise<unknown>,
    readonly now = Date.now,
  ) {}

  refresh() {
    this.running ??= this.run().finally(() => {
      this.running = undefined;
    });

    return this.running;
  }

  private async run() {
    let latest: ExpeditionScoreVersion | undefined;
    let observedAt = BigInt(this.now());

    for (let page = 0; page < 4; page++) {
      observedAt = BigInt(this.now());
      const rows = await this.source.page(this.cursor, observedAt);
      latest = await this.projection.write(rows, observedAt);
      const last = rows.at(-1);
      this.cursor =
        rows.length === 64 && last
          ? { periodId: last.periodId, stage: last.stage, member: last.member }
          : undefined;

      if (!this.cursor) {break;}
    }

    const clock = await this.source.clock();

    if (clock && latest) {await this.publish(clock, latest, observedAt);}
  }
}

export class ExpeditionLiveViewService {
  constructor(
    readonly source: ExpeditionLiveSource,
    readonly now = Date.now,
  ) {}

  async enrich(owner: string, body: Fields): Promise<Fields> {
    const view = await this.source.owned(owner, BigInt(this.now()));

    if (
      !view ||
      int(body, "state", -1) !== view.stage ||
      body.startTime?.value !== view.startTime ||
      body.endTime?.value !== view.endTime
    )
      {return body;}

    const fallback = { ...body, rank: sfs.int(-1) };
    let totals;

    try {
      totals = await this.source.shared(view);
    } catch {
      return fallback;
    }

    if (!totals) {return fallback;}

    const kingdoms = body.kingdominfolist?.value;

    if (!Array.isArray(kingdoms)) {throw new Error("Missing native expedition kingdoms");}

    return {
      ...body,
      rank: sfs.int(totals.rank),
      alliancescore: sfs.double(totals.allianceScore),
      kingdominfolist: sfs.array(
        kingdoms.map((value) => {
          if (
            !value ||
            typeof value !== "object" ||
            !("value" in value) ||
            !value.value ||
            typeof value.value !== "object"
          )
            {throw new Error("Invalid native expedition kingdom");}

          const fields = value.value as Fields,
            id = int(fields, "serverid");

          if (id !== view.kingdomId && id !== view.opponent)
            {throw new Error("Foreign native expedition kingdom");}

          return sfs.object({
            ...fields,
            score: sfs.string(
              expeditionScoreText(id === view.kingdomId ? totals.ownScore : totals.otherScore),
            ),
          });
        }),
      ),
    };
  }
}

import { expeditionScoreText } from "@opencok/mappings/new-expedition";
