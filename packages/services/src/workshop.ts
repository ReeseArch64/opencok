import { TimedActivityAction } from "@opencok/enums/timed-activity-action";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { num, text, long } from "@opencok/contracts/rows";
import { encode, int, str, sfs, type Fields } from "@opencok/messages/sfs";
import type {
  ActivityAction,
  PreparedActivity,
  TimedActivity,
} from "@opencok/contracts/timed-activity";
import { cityAmount, cityDuration, cityInteger } from "@opencok/rules/city-progression";
import { equipmentCosts } from "@opencok/rules/equipment";
import { idleDeadline } from "@opencok/rules/timed-activity";
import { equipmentItem } from "@opencok/mappings/equipment";
import { queue as queueView } from "@opencok/mappings/city";
import type { CityDomain } from "./city-domain.ts";
import type { CityProgressionContext } from "./city-progression-context.ts";
import { refreshQuests } from "./quests";
import { CityCommandDomain } from "./city-command-domain.ts";

const invalid = () => {
  throw new GameError(errors.invalid, "city_progression");
};
const quantity = (context: CityProgressionContext) => (id: string) =>
  context.economy.quantity?.(id) ?? 0;

const workshopCommands = ["create.tool", "queue.tool", "rm.tool", "tool.queue.buy"];

function workshopQueue(context: CityProgressionContext) {
  const row = context.state.queues.find((row) => num(row, "type") === 12 && num(row, "qid") === 1);

  if (!row) throw new GameError(errors.queue, "city_progression");

  return row;
}

function workshopDuration(context: CityProgressionContext, id: string) {
  const good = context.rules.goods.get(id),
    parts = good?.make?.split("|");

  if (!parts || good?.type !== "7") invalid();

  return cityDuration(
    cityInteger(parts![1]),
    context.effect(204) + context.effect(2157),
    context.effect(248) * 60 + context.effect(2156),
  );
}

async function prepareWorkshop(
  context: CityProgressionContext,
  command: string,
  params: Fields,
): Promise<PreparedActivity> {
  const row = workshopQueue(context),
    items = text(row, "itemId").split(";").filter(Boolean);
  let body: Fields = {};

  if (command === "create.tool") {
    const id = str(params, "itemId"),
      durationMs = workshopDuration(context, id),
      max = Math.max(1, num(context.state.quests?.mixed ?? {}, "materialBackup")),
      index = int(params, "index", 0);

    if (index < 0) invalid();

    if (items.length && index > 0 && index < items.length) items[index] = id;
    else {
      if (items.length >= max) throw new GameError(errors.full, "city_progression");

      items.push(id);
    }

    const queueItemId = items.join(";") + ";";

    if (long(row, "updateTime") === idleDeadline)
      return {
        type: 12,
        itemId: id,
        queueItemId,
        durationMs,
        data: context.data("material"),
        response: encode({ itemId: sfs.string(id) }),
      };

    context.write.queueUpdates = [{ ...row, itemId: queueItemId }];
    body = queueView({ ...row, itemId: queueItemId }, {}, false);
  } else if (command === "rm.tool") {
    const index = cityInteger(int(params, "index"), 1, items.length - 1);
    items.splice(index, 1);
    context.write.queueUpdates = [{ ...row, itemId: items.join(";") + ";" }];
    body = queueView(context.write.queueUpdates[0]!, {}, false);
  } else if (command === "tool.queue.buy") {
    const prior = Math.max(1, num(context.state.quests?.mixed ?? {}, "materialBackup")),
      next = prior + 1;
    const superLevel = num(context.state.effects.vip ?? {}, "sLevel");

    if (
      next > 6 &&
      next >
        6 + Number(context.rules.power.superVip?.get(String(7009 + superLevel))?.queue_num ?? 0)
    )
      invalid();

    const rule = context.rules.role(next > 6 ? 50 + superLevel : prior),
      [type, amount] = rule.queue_unlock?.split("|") ?? [];

    if (type === "5") context.economy.gold(-cityAmount(amount));
    else context.spend(equipmentCosts(`${type};${amount}`), false);

    context.write.materialBackup = next;
    body = {
      materialBackup: sfs.int(next),
      gold: sfs.long(context.balance("gold")),
      resource: sfs.object(context.resource()),
    };
  } else body = queueView(row, {}, false);

  return { response: encode(body), event: null };
}

async function applyWorkshop(
  context: CityProgressionContext,
  action: ActivityAction,
  activity: TimedActivity,
): Promise<Fields> {
  const row = workshopQueue(context),
    items = text(row, "itemId").split(";").filter(Boolean),
    id = items[0];

  if (!id || !activity.itemId.split(";").includes(id)) invalid();

  if (action === TimedActivityAction.Start) invalid();

  if (action === TimedActivityAction.Restore && num(row, "para") > 0) {
    const completed = cityInteger(num(row, "para"), 0, items.length - 1);

    for (const prior of items.splice(0, completed)) context.economy.item(prior, 1);

    context.write.queueUpdates = [{ ...row, itemId: items.join(";") + ";", para: 0 }];

    return { itemId: sfs.string(items[0]!) };
  }

  if (action === TimedActivityAction.Restore || action === TimedActivityAction.Reschedule)
    return { itemId: sfs.string(id!) };

  if (action === TimedActivityAction.Cancel) {
    context.write.queueUpdates = [{ ...row, itemId: "", para: 0 }];

    return {};
  }

  context.economy.item(id!, 1);
  items.shift();
  context.write.queueUpdates = [
    { ...row, itemId: items.length ? items.join(";") + ";" : "", para: 0 },
  ];
  refreshQuests(context, { main: 49, count: 1, key: String(Number(id) % 10) });

  return {
    add: sfs.object(
      equipmentItem(id!, quantity(context)(id!), context.economy.itemState?.(id!), context.rules),
    ),
  };
}

async function nextWorkshop(context: CityProgressionContext, activity: TimedActivity) {
  const row = workshopQueue(context),
    id = text(row, "itemId").split(";").filter(Boolean)[0];

  if (!id) return undefined;

  return {
    type: 12,
    itemId: id,
    queueItemId: text(row, "itemId"),
    durationMs: workshopDuration(context, id),
    startedAt: context.now > activity.dueAt ? context.now : activity.dueAt,
    data: context.data("material"),
    response: encode({}),
  };
}

async function accelerateWorkshop(
  context: CityProgressionContext,
  activity: TimedActivity,
  remaining: bigint,
) {
  const mixed = context.state.quests?.mixed ?? {},
    today = context.now / 86400000n;
  const used =
    long(mixed, "materialCdTime") / 86400000n === today ? num(mixed, "materialCdNum") : 0;

  if (used >= cityInteger(context.rules.items.get("equip")?.k12)) invalid();

  const id = activity.itemId.split(";")[0]!,
    make = context.rules.goods.get(id)?.make?.split("|");

  if (!make) invalid();

  const seconds = Number(remaining / 1000n),
    cost = Math.floor(
      Math.fround(cityInteger(make![2]) * Math.fround(seconds / cityInteger(make![1], 1))) + 0.5,
    );
  context.economy.gold(-BigInt(cityInteger(cost)));
  context.write.materialAcceleration = { materialCdNum: used + 1, materialCdTime: context.now };
}

export class WorkshopDomain extends CityCommandDomain {
  public readonly commands: CityDomain["commands"] = workshopCommands;
  public readonly types: CityDomain["types"] = [12];
  public readonly prepare: CityDomain["prepare"] = prepareWorkshop;
  public readonly apply: CityDomain["apply"] = applyWorkshop;
  public readonly next: NonNullable<CityDomain["next"]> = nextWorkshop;
  public readonly accelerate: NonNullable<CityDomain["accelerate"]> = accelerateWorkshop;
}

export const workshopDomain: CityDomain = new WorkshopDomain();
