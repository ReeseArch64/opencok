import { sfs, type Fields } from "@opencok/messages/sfs";
import type { AllianceRecord as Row } from "../contracts/records";
import type { AllianceRecordReaders } from "../contracts/readers";
import type {
    AllianceScienceCatalog,
    AllianceScienceRule,
    AllianceScienceStage,
} from "../contracts/science-catalog";
import type { AllianceScienceResponseContext } from "../contracts/science";
import { AllianceSciencePolicy } from "../rules/science";
import { allianceScienceAssets as assets } from "../constants/science";

export class AllianceScienceMapper
{
    public constructor(
        private readonly runtime: AllianceRecordReaders,
        private readonly policy: AllianceSciencePolicy,
    )
    {}

    public project(
        row: Row,
        rule: AllianceScienceRule,
        stage: AllianceScienceStage,
        queue: Row | undefined,
        rules: AllianceScienceCatalog,
    ): Fields
    {
        const { num, long } = this.runtime;

        return {
            scienceId: sfs.int(num(row, "scienceId")),
            level: sfs.int(num(row, "level")),
            currentPro: sfs.int(stage.current),
            totalPro: sfs.int(num(row, "donateprogress")),
            needPro: sfs.int(stage.required),
            star: sfs.int(stage.stage + 1),
            para1: sfs.string(rule.para1 ?? ""),
            para2: sfs.string(rule.para2 ?? "0"),
            points: sfs.string(rule.points ?? "0"),
            nextPara2: sfs.string(
                rules.power.allianceSciences?.get(
                    String(num(row, "scienceId") + num(row, "level") + 1),
                )?.para2 ?? "0",
            ),
            ...(queue
                ? {
                    startTime: sfs.long(long(queue, "startTime")),
                    finishTime: sfs.long(long(queue, "startTime") + long(queue, "needTime")),
                }
                : {}),
        };
    }

    options(row: Row): Fields
    {
        const { text, num } = this.runtime;

        return {
            scienceId: sfs.int(num(row, "scienceid")),
            ...Object.fromEntries(
                ["low", "mid", "high"].flatMap((prefix) => [
                    [
                        prefix + "Res",
                        sfs.int(
                            assets.indexOf(text(row, prefix + "res") as (typeof assets)[number]),
                        ),
                    ],
                    [prefix + "Num", sfs.int(num(row, prefix + "num"))],
                    [prefix + "Contribute", sfs.int(num(row, prefix + "contribute"))],
                    [
                        prefix + "Progress",
                        sfs.int(num(row, prefix === "high" ? "higprogress" : prefix + "progress")),
                    ],
                    ...(prefix === "low"
                        ? []
                        : [[prefix + "Available", sfs.int(num(row, prefix + "Available"))]]),
                ]),
            ),
        };
    }

    option(row: Row, prefix: string): Fields
    {
        const { text, num } = this.runtime;

        return {
            resource: sfs.string(text(row, prefix + "res")),
            num: sfs.int(num(row, prefix + "num")),
            contribute: sfs.int(num(row, prefix + "contribute")),
            progress: sfs.int(num(row, prefix === "high" ? "higprogress" : prefix + "progress")),
        };
    }

    public publication(
        science: Row,
        rules: AllianceScienceCatalog,
        researchRows: readonly Row[],
    ): Fields
    {
        const { num } = this.runtime;
        const { allianceScienceRule, allianceScienceStage } = this.policy;

        const rule = allianceScienceRule(rules, num(science, "scienceId"), num(science, "level")),
            stage = allianceScienceStage(rule, num(science, "donateprogress")),
            research = researchRows.find((row) => row.scienceId === science.scienceId);

        return this.project(science, rule, stage, research, rules);
    }

    public cooldown(gold: bigint): Fields
    {
        return { gold: sfs.long(gold), donateCDTime: sfs.long(0n) };
    }

    public targets(selected: string[]): Fields
    {
        return { targetScience: sfs.string(selected.join(";")) };
    }

    public research(snapshot: Fields, now: bigint, duration: bigint): Fields
    {
        return { ...snapshot, startTime: sfs.long(now), finishTime: sfs.long(now + duration) };
    }

    public donation(
        next: Row,
        offers: Row,
        c: AllianceScienceResponseContext,
        nextCd: bigint,
        contribution: number,
        quantity: number,
        resource: string,
        progress: number,
        snapshot: (row: Row) => Fields,
    ): Fields
    {
        const { num, long } = this.runtime;

        return {
            ...snapshot(next),
            options: sfs.object(this.options(offers)),
            point: sfs.int(num(c.member(), "point")),
            accPoint: sfs.int(num(c.member(), "accPoint")),
            alliancepoint: sfs.long(long(c.alliance(), "alliancepoint")),
            gold: sfs.long(c.ledger.total()),
            donateCDTime: sfs.long(nextCd),
            donateAvailable: sfs.long(BigInt(num(c.member(), "donateAvailable"))),
            contributeValue: sfs.int(contribution),
            resourceCostValue: sfs.int(quantity),
            resourceCostType: sfs.int(assets.indexOf(resource as (typeof assets)[number])),
            dp: sfs.int(progress),
        };
    }
}
