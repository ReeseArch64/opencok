import { sfs, str, int, type Fields } from "@opencok/messages/sfs";
import type { AllianceRecord as Row } from "../contracts/records";
import type { HelpGeneration, AllianceHelpContext } from "../contracts/help";
import type { AllianceHelpRuntime } from "../contracts/help-runtime";
import { AllianceHelpPolicy } from "../rules/help-generation";
import { AllianceHelpMapper } from "../mappings/help";
import { AllianceHelpCommand, AllianceHelpPush } from "../enums/help-command";
import { AllianceProgressAction } from "../enums/progress-action";

export class AllianceHelpService<TCatalog>
{
    public constructor(
        readonly c: AllianceHelpContext<TCatalog>,
        private readonly runtime: AllianceHelpRuntime<TCatalog>,
        private readonly policy: AllianceHelpPolicy,
        private readonly mapper: AllianceHelpMapper,
    )
    {}

    activity(help: Row)
    {
        const { text, num, long } = this.runtime;
        const allianceFailure: () => never = this.runtime.allianceFailure;
        const { generation } = this.policy;

        let saved: HelpGeneration,
            legacy = false;

        try
        {
            saved = generation(help);
        }
        catch
        {
            const raw = Buffer.isBuffer(help.helpers)
                ? help.helpers.toString("utf8").replace(/[\s\0]+$/g, "")
                : "";

            if (raw.startsWith("{") || raw.length > 65535)
            {
                allianceFailure();
            }

            const previous = this.c.state.activities.find(
                (row) =>
                    row.queueId === help.content && row.ownerId === help.senderId
                    && row.type === help.type,
            );

            if (
                !previous
                || long(help, "startTime") < long(previous, "startedAt")
                || long(help, "startTime") >= long(previous, "dueAt")
            )
            {
                allianceFailure();
            }

            const helpers = raw.split(",").filter(Boolean);

            if (
                helpers.some((id) => id.length > 40)
                || new Set(helpers).size !== helpers.length
                || helpers.length !== num(help, "nowcount")
            )
            {
                allianceFailure();
            }

            saved = { version: 1, activityId: text(previous, "id"), helpers };
            legacy = true;
        }

        const activity = (this.c.write.activities ?? []).find((row) => row.id === saved.activityId)
            ?? this.c.state.activities.find((row) => row.id === saved.activityId);

        if (
            !activity
            || activity.ownerId !== help.senderId
            || activity.queueId !== help.content
            || (!legacy && activity.startedAt !== help.startTime)
            || long(activity, "dueAt") <= this.c.now
            || num(help, "isvalid") !== 1
            || help.allianceId !== this.c.allianceId
        )
        {
            allianceFailure();
        }

        this.c.member(text(help, "senderId"));

        return { activity, saved };
    }

    snapshot(help: Row): Fields
    {
        const { text } = this.runtime;
        const { activity } = this.activity(help),
            profile = this.c.profile(text(help, "senderId"));

        return this.mapper.snapshot(help, activity, profile, this.c.allianceId, this.c.owner);
    }

    available()
    {
        const { num } = this.runtime;
        const allianceFailure: () => never = this.runtime.allianceFailure;

        if (this.c.state.helps.length > 4096)
        {
            allianceFailure();
        }

        return this.c.state.helps.filter((row) => {
            try
            {
                const { saved } = this.activity(row);

                return (
                    row.senderId === this.c.owner
                    || (num(row, "nowcount") < num(row, "maxcount")
                        && !saved.helpers.includes(this.c.owner))
                );
            }
            catch
            {
                return false;
            }
        });
    }

    help(row: Row): Fields
    {
        const { num, long, cityInteger } = this.runtime;
        const allianceFailure: () => never = this.runtime.allianceFailure;

        const { activity, saved } = this.activity(row);

        if (
            row.senderId === this.c.owner
            || saved.helpers.includes(this.c.owner)
            || num(row, "nowcount") >= num(row, "maxcount")
        )
        {
            allianceFailure();
        }

        const queue = this.c.state.queues.find(
            (queue) => queue.uuid === activity.queueId && queue.ownerId === activity.ownerId,
        );

        if (
            !queue
            || long(queue, "updateTime")
                !== long(
                    this.c.state.activities.find((row) => row.id === activity.id) ?? {},
                    "dueAt",
                )
        )
        {
            allianceFailure();
        }

        const before = long(activity, "dueAt"),
            reduction = BigInt(cityInteger(num(row, "reduceSec"), 1)),
            dueAt = before - reduction < this.c.now ? this.c.now : before - reduction;
        const changed = {
            ...activity,
            dueAt,
            version: cityInteger(num(activity, "version") + 1, 1),
        };
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
            helpers: Buffer.from(
                JSON.stringify({ ...saved, helpers: [...saved.helpers, this.c.owner] }),
            ),
        };
        this.c.write.helps = [
            ...(this.c.write.helps ?? []).filter((value) => value.helpId !== row.helpId),
            next,
        ];
        const response = this.mapper.result(row, next, queue, dueAt, () => this.c.profile());
        const previous =
            this.c.write.actions?.find((row) => row.kind === AllianceProgressAction.Help)?.count
                ?? 0;
        this.c.write.actions = [{
            uid: this.c.owner,
            kind: AllianceProgressAction.Help,
            count: previous + 1,
        }];

        return response;
    }

    async command(command: string, params: Fields): Promise<Fields>
    {
        const { text, num, long, cityInteger, cityBuildingParameter, randomUUID } = this.runtime;
        const allianceFailure: () => never = this.runtime.allianceFailure;

        this.c.right("help");

        if (command === AllianceHelpCommand.Show)
        {
            return {
                helps: sfs.array(this.available().map((row) => sfs.object(this.snapshot(row)))),
            };
        }

        if (command === AllianceHelpCommand.All)
        {
            return {
                helps: sfs.array(
                    this.available()
                        .filter((row) => row.senderId !== this.c.owner)
                        .slice(0, 128)
                        .map((row) => sfs.object(this.help(row))),
                ),
            };
        }

        if (command === AllianceHelpCommand.Render)
        {
            if (params.uid && str(params, "uid") !== this.c.owner)
            {
                allianceFailure();
            }

            const help = this.c.state.helps.find((row) => row.helpId === str(params, "helpId"));

            if (!help)
            {
                allianceFailure();
            }

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
            !queue
            || !activity
            || ![0, 3, 6, 11].includes(num(activity, "type"))
            || num(queue, "isHelped") === 1
            || long(activity, "dueAt") <= this.c.now
            || long(queue, "updateTime") !== long(activity, "dueAt")
            || int(params, "qType") !== num(activity, "type")
        )
        {
            allianceFailure();
        }

        const embassy = this.c.state.cities.find(
            (row) =>
                row.uid === this.c.owner && num(row, "itemId") === 402000 && num(row, "level") > 0,
        );

        if (!embassy)
        {
            allianceFailure();
        }

        const building = num(activity, "type") === 0
            ? this.c.state.cities.find(
                (row) => row.uuid === activity.itemId && row.uid === this.c.owner,
            )
            : undefined;
        const itemId = building ? text(building, "itemId") : text(activity, "itemId");

        if (params.itemId && str(params, "itemId") !== itemId)
        {
            allianceFailure();
        }

        const count = cityInteger(
                cityBuildingParameter(embassy, this.c.rules, 0) + (await this.c.effect(161)),
                1,
                2048,
            ),
            reduction = cityInteger(
                (cityBuildingParameter(embassy, this.c.rules, 1) + (await this.c.effect(142)))
                    * 1000,
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
            helpers: Buffer.from(
                JSON.stringify({ version: 1, activityId: activity.id, helpers: [] }),
            ),
            star: num(building ?? {}, "star"),
            progress: num(building ?? {}, "progress"),
        };
        this.c.write.helps = [help];
        this.c.write.queues = [{ ...queue, isHelped: 1 }];
        const response = this.snapshot(help);
        this.c.ledger.pushes.push({ command: AllianceHelpPush.New, body: response });

        return response;
    }
}
