import { sfs, str, int, type Fields } from "@opencok/messages/sfs";
import type { AllianceRecord as Row } from "../contracts/records";
import type { AllianceScienceContext, AllianceScienceLedger } from "../contracts/science";
import type { AllianceScienceRuntime } from "../contracts/science-runtime";
import { AllianceSciencePolicy } from "../rules/science";
import { AllianceScienceMapper } from "../mappings/science";
import { allianceScienceAssets as assets } from "../constants/science";
import { AllianceScienceCommand, AllianceSciencePush } from "../enums/science-command";
import { AllianceProgressAction } from "../enums/progress-action";

export class AllianceScienceService<TLedger extends AllianceScienceLedger>
{
    public constructor(
        readonly context: AllianceScienceContext<TLedger>,
        private readonly runtime: AllianceScienceRuntime<TLedger>,
        private readonly policy: AllianceSciencePolicy,
        private readonly mapper: AllianceScienceMapper,
    )
    {}

    get c()
    {
        return this.context;
    }

    row(id: number)
    {
        const { num } = this.runtime;
        const { allianceScienceRule, allianceScienceRow } = this.policy;

        allianceScienceRule(this.c.rules, id);

        return allianceScienceRow(
            this.c.allianceId,
            id,
            (this.c.write.sciences ?? this.c.state.sciences).find(
                (row) => row.allianceId === this.c.allianceId && num(row, "scienceId") === id,
            ),
        );
    }

    snapshot(row: Row): Fields
    {
        const { text, num } = this.runtime;
        const { allianceScienceRule, allianceScienceStage } = this.policy;

        const rule = allianceScienceRule(this.c.rules, num(row, "scienceId"), num(row, "level")),
            stage = allianceScienceStage(rule, num(row, "donateprogress")),
            queue = this.c.write.deletedResearch?.includes(text(row, "allianceId"))
                ? undefined
                : this.c.state.research.find(
                    (queue) =>
                        queue.allianceId === row.allianceId
                        && num(queue, "scienceId") === num(row, "scienceId"),
                );

        return this.mapper.project(row, rule, stage, queue, this.c.rules);
    }

    snapshots(id: string)
    {
        const { num } = this.runtime;
        const { allianceScienceRow } = this.policy;

        const rows = [...(this.c.rules.power.allianceSciences?.values() ?? [])]
            .filter((rule) => rule.science_lv === "0")
            .map((rule) =>
                allianceScienceRow(
                    id,
                    Number(rule.id),
                    (this.c.write.sciences ?? []).find(
                        (row) => row.allianceId === id && num(row, "scienceId") === Number(rule.id),
                    )
                        ?? this.c.state.sciences.find(
                            (row) =>
                                row.allianceId === id && num(row, "scienceId") === Number(rule.id),
                        ),
                )
            );

        return sfs.array(rows.map((row) => sfs.object(this.snapshot(row))));
    }

    complete(): Fields
    {
        const { text, num, long, cityInteger } = this.runtime;
        const { allianceScienceRule, allianceScienceRow } = this.policy;
        const allianceFailure: () => never = this.runtime.allianceFailure;

        if (!this.c.allianceId)
        {
            return {};
        }

        const queue = this.c.state.research.find((row) => row.allianceId === this.c.allianceId);

        if (!queue || long(queue, "startTime") + long(queue, "needTime") > this.c.now)
        {
            return {};
        }

        const id = num(queue, "scienceId"),
            row = this.row(id),
            data = queue.accelerate;
        let saved: { version: number; from: number; to: number; power: number; };

        try
        {
            if (!data || (Buffer.isBuffer(data) && data.length === 0))
            {
                const target = allianceScienceRule(this.c.rules, id, num(row, "level") + 1);

                if (long(row, "researchstarttime") !== long(queue, "startTime"))
                {
                    allianceFailure();
                }

                saved = {
                    version: 1,
                    from: num(row, "level"),
                    to: num(row, "level") + 1,
                    power: cityInteger(target.power),
                };
            }
            else
            {
                saved = JSON.parse(Buffer.isBuffer(data) ? data.toString("utf8") : "");
            }
        }
        catch
        {
            allianceFailure();
        }

        if (saved.version !== 1 || saved.from !== num(row, "level") || saved.to !== saved.from + 1)
        {
            allianceFailure();
        }

        allianceScienceRule(this.c.rules, id, saved.to);
        const next = {
            ...allianceScienceRow(this.c.allianceId, id),
            level: cityInteger(saved.to, 1),
            power: cityInteger(saved.power),
        };
        this.c.write.sciences = [next];
        this.c.write.deletedResearch = [this.c.allianceId];
        this.c.productionAt = this.c.now;

        for (const member of this.c.list())
        {
            this.c.productionOwners.add(text(member, "uid"));
        }

        this.c.ledger.pushes.push({
            command: AllianceSciencePush.Update,
            body: this.snapshot(next),
        });

        return this.snapshot(next);
    }

    offers(id: number, previous?: Row, used?: number): Row
    {
        const { num, text, cityInteger, randomInt } = this.runtime;
        const { allianceScienceRule, allianceScienceStage } = this.policy;

        const c = this.c,
            science = this.row(id),
            rule = allianceScienceRule(c.rules, id, num(science, "level")),
            stage = allianceScienceStage(rule, num(science, "donateprogress")).stage;
        const config = c.rules.items.get("alliance_science"),
            button = c.rules.items.get("alliance_science1"),
            resource = assets[cityInteger(rule.resource?.split(";")[stage], 0, 5)]!;
        const progress = cityInteger(rule.schedule, 1)
                * (randomInt(10000) < c.scienceEffect(145) * 100 ? 2 : 1),
            contribution = cityInteger(rule.contribution, 1)
                * (randomInt(10000) < c.scienceEffect(146) * 100 ? 2 : 1),
            low = cityInteger(rule.donate?.split(";")[stage], 1);
        const next: Row = {
            uerid: c.owner,
            scienceid: id,
            lowres: resource,
            lownum: low,
            lowcontribute: cityInteger(contribution),
            lowprogress: cityInteger(progress),
            lastrefreshtime: c.now,
            highNotUse: 0,
            midNotUse: 0,
            ...previous,
        };
        Object.assign(next, {
            lowres: resource,
            lownum: low,
            lowcontribute: contribution,
            lowprogress: progress,
            lastrefreshtime: c.now,
        });
        const same = randomInt(1000),
            available = randomInt(1000);

        for (
            const [prefix, index] of [
                ["mid", 1],
                ["high", 2],
            ] as const
        )
        {
            const counter = prefix + "NotUse",
                notUsed = used === undefined
                    ? num(next, counter)
                    : used < index
                    ? num(next, counter) + 1
                    : 0;

            if (
                !previous
                || used === index
                || notUsed > cityInteger(config?.[index === 1 ? "k7" : "k8"], 1)
                || ![resource, "gold"].includes(text(previous, prefix + "res"))
            )
            {
                const gold = same >= cityInteger(config?.[index === 1 ? "k9" : "k10"], 0, 1000),
                    multiple = cityInteger(config?.[index === 1 ? "k11" : "k12"], 1);
                next[prefix + "res"] = gold ? "gold" : resource;
                next[prefix + "num"] = gold
                    ? cityInteger(button?.[index === 1 ? "k3" : "k4"], 1)
                    : cityInteger(low * cityInteger(button?.[index === 1 ? "k1" : "k2"], 1), 1);
                next[prefix + "contribute"] = cityInteger(contribution * multiple, 1);
                next[prefix === "high" ? "higprogress" : prefix + "progress"] = cityInteger(
                    progress * multiple,
                    1,
                );
                next[counter] = 0;
                next[prefix + "Available"] =
                    available < cityInteger(config?.[index === 1 ? "k1" : "k2"], 0, 1000) ? 1 : 0;
            }
            else
            {
                next[counter] = notUsed;
            }
        }

        return next;
    }

    async command(command: string, params: Fields): Promise<Fields>
    {
        const { text, num, long, cityInteger, activityEconomy, rankingCalendar } = this.runtime;
        const { allianceScienceRule, allianceScienceStage, allianceDonationCount } = this.policy;
        const allianceFailure: () => never = this.runtime.allianceFailure;

        const c = this.c,
            member = c.member(),
            config = c.rules.items.get("alliance_science"),
            economy = activityEconomy(c.ledger);

        if (command === AllianceScienceCommand.Cooldown)
        {
            const remaining = long(member, "donateCDTime") - c.now;

            if (remaining <= 0n)
            {
                allianceFailure();
            }

            const cost = Math.max(
                1,
                Math.floor(Number(remaining) / 1000 / cityInteger(config?.k4, 1)),
            );
            economy.gold(-BigInt(cost));
            c.setMember({ ...member, donateCDTime: 0n, donateAvailable: 1 });

            return this.mapper.cooldown(c.ledger.total());
        }

        if (command === AllianceScienceCommand.Target)
        {
            c.right("alliancescience");
            const id = cityInteger(Number(str(params, "scienceId")), 1);
            this.row(id);
            let selected: string[];

            try
            {
                selected = JSON.parse(text(c.alliance(), "targetScience") || "[]");
            }
            catch
            {
                allianceFailure();
            }

            if (!Array.isArray(selected) || selected.some((id) => typeof id !== "string"))
            {
                allianceFailure();
            }

            selected = selected.filter((value) => value !== String(id));

            if (cityInteger(int(params, "isuse"), 0, 1))
            {
                selected.push(String(id));
            }

            if (JSON.stringify(selected).length > 255)
            {
                allianceFailure();
            }

            c.setAlliance({ ...c.alliance(), targetScience: JSON.stringify(selected) });

            return this.mapper.targets(selected);
        }

        const id = cityInteger(int(params, "scienceId"), 1),
            row = this.row(id),
            rule = allianceScienceRule(c.rules, id, num(row, "level"));

        if (num(row, "level") >= cityInteger(rule.max_lv, 1))
        {
            allianceFailure();
        }

        if (command === AllianceScienceCommand.Fresh)
        {
            const previous = c.state.donations.find((row) => num(row, "scienceid") === id),
                next = previous ?? this.offers(id);

            if (!previous)
            {
                c.write.donations = [next];
            }

            return this.mapper.options(next);
        }

        if (command === AllianceScienceCommand.Research)
        {
            c.right("alliancescience");

            if (
                c.state.research.some((row) => row.allianceId === c.allianceId)
                || num(row, "donatefinish") !== 1
                || num(row, "donateprogress")
                    < allianceScienceStage(rule, num(row, "donateprogress")).total
            )
            {
                allianceFailure();
            }

            const target = allianceScienceRule(c.rules, id, num(row, "level") + 1),
                duration = BigInt(
                    Math.max(
                        1,
                        Math.ceil(
                            (cityInteger(rule.time, 1) * 1000) / (1 + c.scienceEffect(510) / 100),
                        ),
                    ),
                );

            for (const member of c.list())
            {
                c.productionOwners.add(text(member, "uid"));
            }

            c.write.sciences = [{ ...row, researchstarttime: c.now }];
            c.write.research = [
                {
                    allianceId: c.allianceId,
                    scienceId: id,
                    startTime: c.now,
                    needTime: duration,
                    accelerate: Buffer.from(
                        JSON.stringify({
                            version: 1,
                            from: num(row, "level"),
                            to: num(row, "level") + 1,
                            power: cityInteger(target.power),
                        }),
                    ),
                },
            ];

            return this.mapper.research(this.snapshot(row), c.now, duration);
        }

        if (command !== AllianceScienceCommand.Donate)
        {
            allianceFailure();
        }

        const cd = long(member, "donateCDTime"),
            available = cd <= c.now ? 1 : Number(member.donateAvailable ?? 1),
            first =
                Number(c.state.lords.find((row) => row.uid === c.owner)?.firstJoinAllianceFlag ?? 1)
                    === 1;

        if (
            !available
            || cd - c.now > BigInt(cityInteger(config?.k6, 1)) * 1000n
            || long(member, "donateTime") > c.now
            || (!first
                && c.now - long(member, "jointime") <= BigInt(cityInteger(config?.k3, 1)) * 1000n)
            || num(row, "donatefinish") === 1
            || c.state.research.some(
                (queue) => queue.allianceId === c.allianceId && num(queue, "scienceId") === id,
            )
        )
        {
            allianceFailure();
        }

        const option = cityInteger(int(params, "option"), 0, 2),
            prefix = ["low", "mid", "high"][option]!,
            offer = c.state.donations.find((row) => num(row, "scienceid") === id);

        if (!offer || (option > 0 && num(offer, prefix + "Available") !== 1))
        {
            allianceFailure();
        }

        const resource = text(offer, prefix + "res"),
            quantity = cityInteger(num(offer, prefix + "num"), 1),
            contribution = cityInteger(num(offer, prefix + "contribute"), 1),
            progress = cityInteger(
                num(offer, option === 2 ? "higprogress" : prefix + "progress"),
                1,
            );

        if (!(assets as readonly string[]).includes(resource))
        {
            allianceFailure();
        }

        if (resource === "gold")
        {
            economy.gold(-BigInt(quantity));
        }
        else
        {
            const asset = resource as Exclude<(typeof assets)[number], "gold">,
                bound = asset + "bind",
                boundBalance = ["wood", "stone", "iron", "food"].includes(asset)
                    ? long(c.state.inventory.resource, bound)
                    : 0n,
                take = boundBalance < BigInt(quantity) ? boundBalance : BigInt(quantity);

            if (take)
            {
                economy.resource(bound as "woodbind", -take);
            }

            if (BigInt(quantity) > take)
            {
                economy.resource(asset, -(BigInt(quantity) - take));
            }
        }

        const total = allianceScienceStage(rule, num(row, "donateprogress")).total,
            nextProgress = Math.min(total, num(row, "donateprogress") + progress),
            next = {
                ...row,
                donateprogress: nextProgress,
                donatefinish: nextProgress >= total ? 1 : 0,
            };
        c.write.sciences = [next];
        const nextCd = (cd > c.now ? cd : c.now) + BigInt(cityInteger(config?.k5, 1)) * 1000n,
            sameDay = long(member, "donateTime") / 86400000n === c.now / 86400000n;
        c.setMember({
            ...member,
            point: allianceDonationCount(member, "point", contribution),
            accPoint: allianceDonationCount(member, "accPoint", contribution),
            progress: allianceDonationCount(member, "progress", progress),
            [resource]: allianceDonationCount(member, resource, quantity),
            todaydonate: cityInteger((sameDay ? num(member, "todaydonate") : 0) + contribution),
            todayprogress: cityInteger((sameDay ? num(member, "todayprogress") : 0) + progress),
            donateTime: c.now,
            donateCDTime: nextCd,
            donateAvailable: nextCd - c.now > BigInt(cityInteger(config?.k6, 1)) * 1000n ? 0 : 1,
        });
        c.setAlliance({
            ...c.alliance(),
            alliancepoint: long(c.alliance(), "alliancepoint") + BigInt(contribution),
        });
        const offers = this.offers(id, offer, option);
        c.write.donations = [offers];
        c.write.actions = [{ uid: c.owner, kind: AllianceProgressAction.Donate, count: 1 }];
        const weekStart = rankingCalendar(Number(c.now)).nextMonday - 604800000n,
            history = c.state.history.find(
                (row) =>
                    row.uid === c.owner
                    && row.allianceId === c.allianceId
                    && long(row, "donateTime") >= weekStart,
            ) ?? {};
        c.write.history = [
            {
                uid: c.owner,
                allianceId: c.allianceId,
                donate: cityInteger(num(history, "donate") + contribution),
                progress: cityInteger(num(history, "progress") + progress),
                donateTime: c.now,
            },
        ];

        return this.mapper.donation(
            next,
            offers,
            c,
            nextCd,
            contribution,
            quantity,
            resource,
            progress,
            (row) => this.snapshot(row),
        );
    }
}
