import type { Row } from "@opencok/contracts/rows";
import type { ExpeditionPhaseStore } from "@opencok/contracts/expedition-phase";
import { expeditionPhaseView } from "@opencok/rules/expedition-phase";
import { sfs, encode, str } from "@opencok/messages/sfs";
import { long, num } from "@opencok/contracts/rows";
import { expeditionPhaseOperation } from "@opencok/rules/expedition-phase";
import { expeditionPanels } from "@opencok/mappings/new-expedition";
import type { Rules } from "@opencok/rules/game";
import type { CityDomain } from "./city-progression";
import type { ExpeditionActivityReader } from "@opencok/contracts/expedition-phase";
import { decode, fields, Type, type Fields } from "@opencok/messages/sfs";

export class ExpeditionPhaseService {
  constructor(
    readonly calendar: { refresh(): Promise<Row | undefined> },
    readonly store: ExpeditionPhaseStore,
  ) {}

  async refresh() {
    const period = await this.calendar.refresh();

    if (!period) return;

    return this.store.reconcile(period, (state, now) => expeditionPhaseView(period, state, now));
  }
}

export class ExpeditionActivityService {
  constructor(
    readonly reader: ExpeditionActivityReader,
    readonly rules: Rules,
    readonly now = Date.now,
  ) {}

  async activity(owner: string) {
    const { profile, state } = await this.reader.read(owner);

    return {
      activity: sfs.array(
        expeditionPanels(state, profile, this.rules, BigInt(this.now())).map(sfs.object),
      ),
    };
  }
}

export const expeditionPhaseDomain: CityDomain = {
  commands: ["expedition.notify"],
  types: [],
  async prepare(context, _command, params) {
    const raw = str(params, "revision"),
      state = context.state.expedition,
      clock = state?.clock;

    if (
      !/^[1-9]\d{0,18}$/.test(raw) ||
      !clock ||
      BigInt(raw) !== long(clock, "revision") ||
      str(params, "operationId") !== expeditionPhaseOperation(BigInt(raw))
    )
      throw new Error("Invalid owned expedition notification revision");

    if (!context.economy.event) throw new Error("Expedition phase publication unavailable");

    const panels = expeditionPanels(
      {
        ...state!,
        period: { ...state!.period, periodId: clock.periodId!, matchServerId: clock.opponent! },
        phase: {
          stage: num(clock, "stage"),
          startTime: long(clock, "startTime"),
          endTime: long(clock, "endTime"),
        },
      },
      context.state.profile,
      context.rules,
      context.now,
    );
    context.economy.event({
      id: "expedition-phase",
      type: "expedition.phase",
      payload: encode({
        owner: sfs.string(context.owner),
        revision: sfs.string(raw),
        body: sfs.object({ activity: sfs.array(panels.map(sfs.object)) }),
      }),
    });

    return { response: encode({}), event: null };
  },
  async apply() {
    throw new Error("Unsupported expedition notification activity");
  },
};

export async function publishExpeditionPhaseNotification(
  payload: Uint8Array,
  owner: string,
  revision: bigint | undefined,
  publish: (owner: string, command: string, body: Fields) => Promise<unknown>,
) {
  const data = decode(Buffer.from(payload));

  if (str(data, "owner") !== owner) throw new Error("Foreign expedition activity notification");

  if (revision === undefined || str(data, "revision") !== String(revision)) return false;

  const body = fields(data.body);

  if (body.activity?.type !== Type.Array)
    throw new Error("Malformed expedition activity notification");

  await publish(owner, "push.activity.update", body);

  return true;
}
