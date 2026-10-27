import { randomUUID } from "node:crypto";
import { sfs, str, int, type Fields } from "@opencok/messages/sfs";
import { text, num, long, type Row } from "@opencok/contracts/rows";
import { allianceFailure } from "@opencok/rules/alliance";
import { cityInteger } from "@opencok/rules/city-progression";
import { cityBuildingParameter } from "@opencok/rules/military";
import type { AllianceContext } from "./alliances";

interface HelpGeneration {
  version: 1;
  activityId: string;
  helpers: string[];
}

function generation(row: Row): HelpGeneration {
  let value: HelpGeneration;

  try {
    value = JSON.parse(Buffer.isBuffer(row.helpers) ? row.helpers.toString("utf8") : "");
  } catch {
    allianceFailure();
  }

  if (
    value.version !== 1 ||
    typeof value.activityId !== "string" ||
    !Array.isArray(value.helpers) ||
    value.helpers.length > 2048 ||
    new Set(value.helpers).size !== value.helpers.length ||
    value.helpers.some((id) => typeof id !== "string" || !id || id.length > 40)
  )
    {allianceFailure();}

  return value;
}

export class AllianceHelpContext {
  constructor(readonly c: AllianceContext) {}

  activity(help: Row) {
    let saved: HelpGeneration,
      legacy = false;

    try {
      saved = generation(help);
    } catch {
      const raw = Buffer.isBuffer(help.helpers)
        ? help.helpers.toString("utf8").replace(/[\s\0]+$/g, "")
        : "";

      if (raw.startsWith("{") || raw.length > 65535) {allianceFailure();}

      const previous = this.c.state.activities.find(
        (row) =>
          row.queueId === help.content && row.ownerId === help.senderId && row.type === help.type,
      );

      if (
        !previous ||
        long(help, "startTime") < long(previous, "startedAt") ||
        long(help, "startTime") >= long(previous, "dueAt")
      )
        {allianceFailure();}

      const helpers = raw.split(",").filter(Boolean);

      if (
        helpers.some((id) => id.length > 40) ||
        new Set(helpers).size !== helpers.length ||
        helpers.length !== num(help, "nowcount")
      )
        {allianceFailure();}

      saved = { version: 1, activityId: text(previous, "id"), helpers };
      legacy = true;
    }

    const activity =
      (this.c.write.activities ?? []).find((row) => row.id === saved.activityId) ??
      this.c.state.activities.find((row) => row.id === saved.activityId);

    if (
      !activity ||
      activity.ownerId !== help.senderId ||
      activity.queueId !== help.content ||
      (!legacy && activity.startedAt !== help.startTime) ||
      long(activity, "dueAt") <= this.c.now ||
      num(help, "isvalid") !== 1 ||
      help.allianceId !== this.c.allianceId
    )
      {allianceFailure();}

    this.c.member(text(help, "senderId"));

    return { activity, saved };
  }

  snapshot(help: Row): Fields {
    const { activity } = this.activity(help),
      profile = this.c.profile(text(help, "senderId"));

    return {
      uid: sfs.string(text(help, "helpId")),
      helpId: sfs.string(text(help, "helpId")),
      allianceId: sfs.string(this.c.allianceId),
      senderId: sfs.string(text(help, "senderId")),
      recvId: sfs.string(this.c.owner),
      content: sfs.string(text(help, "content")),
      queueId: sfs.string(text(help, "content")),
      name: sfs.string(text(profile, "name")),
      pic: sfs.string(text(profile, "pic")),
      picVer: sfs.int(num(profile, "picVer")),
      qType: sfs.int(num(help, "type")),
      type: sfs.int(num(help, "type")),
      itemId: sfs.string(text(help, "itemId")),
      level: sfs.int(num(help, "level")),
      maxcount: sfs.int(num(help, "maxcount")),
      nowcount: sfs.int(num(help, "nowcount")),
      maxCount: sfs.int(num(help, "maxcount")),
      nowCount: sfs.int(num(help, "nowcount")),
      star: sfs.int(num(help, "star")),
      progress: sfs.int(num(help, "progress")),
      stats: sfs.int(help.senderId === this.c.owner ? 0 : 1),
      updateTime: sfs.long(long(activity, "dueAt")),
      startTime: sfs.long(long(help, "startTime")),
    };
  }

  available() {
    if (this.c.state.helps.length > 4096) {allianceFailure();}

    return this.c.state.helps.filter((row) => {
      try {
        const { saved } = this.activity(row);

        return (
          row.senderId === this.c.owner ||
          (num(row, "nowcount") < num(row, "maxcount") && !saved.helpers.includes(this.c.owner))
        );
      } catch {
        return false;
      }
    });
  }

  help(row: Row): Fields {
    const { activity, saved } = this.activity(row);

    if (
      row.senderId === this.c.owner ||
      saved.helpers.includes(this.c.owner) ||
      num(row, "nowcount") >= num(row, "maxcount")
    )
      {allianceFailure();}

    const queue = this.c.state.queues.find(
      (queue) => queue.uuid === activity.queueId && queue.ownerId === activity.ownerId,
    );

    if (
      !queue ||
      long(queue, "updateTime") !==
        long(this.c.state.activities.find((row) => row.id === activity.id) ?? {}, "dueAt")
    )
      {allianceFailure();}

    const before = long(activity, "dueAt"),
      reduction = BigInt(cityInteger(num(row, "reduceSec"), 1)),
      dueAt = before - reduction < this.c.now ? this.c.now : before - reduction;
    const changed = { ...activity, dueAt, version: cityInteger(num(activity, "version") + 1, 1) };
    this.c.write.activities = [
      ...(this.c.write.activities ?? []).filter((value) => value.id !== activity.id),
      changed,
    ];
    this.c.write.queues = [
      ...(this.c.write.queues ?? []).filter((value) => value.uuid !== queue.uuid),
      { ...queue, updateTime: dueAt },
    ];
    const next = {
      ...row,
      startTime: long(activity, "startedAt"),
      nowcount: num(row, "nowcount") + 1,
      isvalid: dueAt <= this.c.now ? 0 : 1,
      helpers: Buffer.from(JSON.stringify({ ...saved, helpers: [...saved.helpers, this.c.owner] })),
    };
    this.c.write.helps = [
      ...(this.c.write.helps ?? []).filter((value) => value.helpId !== row.helpId),
      next,
    ];
    const response = {
      queueId: sfs.string(text(queue, "uuid")),
      updateTime: sfs.long(dueAt),
      senderId: sfs.string(text(row, "senderId")),
      helpName: sfs.string(text(this.c.profile(), "name")),
      helpId: sfs.string(text(row, "helpId")),
      itemId: sfs.string(text(row, "itemId")),
      level: sfs.int(num(row, "level")),
      type: sfs.int(num(row, "type")),
      maxCount: sfs.int(num(row, "maxcount")),
      nowCount: sfs.int(num(next, "nowcount")),
    };
    const previous = this.c.write.actions?.find((row) => row.kind === "alliance.help")?.count ?? 0;
    this.c.write.actions = [{ uid: this.c.owner, kind: "alliance.help", count: previous + 1 }];

    return response;
  }

  async command(command: string, params: Fields): Promise<Fields> {
    this.c.right("help");

    if (command === "al.showhelp")
      {return { helps: sfs.array(this.available().map((row) => sfs.object(this.snapshot(row)))) };}

    if (command === "al.helpall")
      {return {
        helps: sfs.array(
          this.available()
            .filter((row) => row.senderId !== this.c.owner)
            .slice(0, 128)
            .map((row) => sfs.object(this.help(row))),
        ),
      };}

    if (command === "al.renderhelp") {
      if (params.uid && str(params, "uid") !== this.c.owner) {allianceFailure();}

      const help = this.c.state.helps.find((row) => row.helpId === str(params, "helpId"));

      if (!help) {allianceFailure();}

      return this.help(help);
    }

    const queueId = str(params, "queueId"),
      queue = this.c.state.queues.find(
        (queue) => queue.uuid === queueId && queue.ownerId === this.c.owner,
      ),
      activity = this.c.state.activities.find(
        (row) => row.queueId === queueId && row.ownerId === this.c.owner,
      );

    if (
      !queue ||
      !activity ||
      ![0, 3, 6, 11].includes(num(activity, "type")) ||
      num(queue, "isHelped") === 1 ||
      long(activity, "dueAt") <= this.c.now ||
      long(queue, "updateTime") !== long(activity, "dueAt") ||
      int(params, "qType") !== num(activity, "type")
    )
      {allianceFailure();}

    const embassy = this.c.state.cities.find(
      (row) => row.uid === this.c.owner && num(row, "itemId") === 402000 && num(row, "level") > 0,
    );

    if (!embassy) {allianceFailure();}

    const building =
      num(activity, "type") === 0
        ? this.c.state.cities.find(
            (row) => row.uuid === activity.itemId && row.uid === this.c.owner,
          )
        : undefined;
    const itemId = building ? text(building, "itemId") : text(activity, "itemId");

    if (params.itemId && str(params, "itemId") !== itemId) {allianceFailure();}

    const count = cityInteger(
        cityBuildingParameter(embassy, this.c.rules, 0) + (await this.c.effect(161)),
        1,
        2048,
      ),
      reduction = cityInteger(
        (cityBuildingParameter(embassy, this.c.rules, 1) + (await this.c.effect(142))) * 1000,
        1,
      );
    const help: Row = {
      helpId: randomUUID(),
      allianceId: this.c.allianceId,
      senderId: this.c.owner,
      content: queueId,
      isvalid: 1,
      maxcount: count,
      nowcount: 0,
      startTime: long(activity, "startedAt"),
      reduceSec: reduction,
      itemId,
      level: building ? num(building, "level") + 1 : 1,
      type: num(activity, "type"),
      helpers: Buffer.from(JSON.stringify({ version: 1, activityId: activity.id, helpers: [] })),
      star: num(building ?? {}, "star"),
      progress: num(building ?? {}, "progress"),
    };
    this.c.write.helps = [help];
    this.c.write.queues = [{ ...queue, isHelped: 1 }];
    const response = this.snapshot(help);
    this.c.ledger.pushes.push({ command: "push.al.help.new", body: response });

    return response;
  }
}
