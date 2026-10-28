import type { AllianceRecord as Row } from "../contracts/records";
import type { AlliancePolicyCatalog as Rules } from "../contracts/governance-catalog";
import type { AlliancePolicyRuntime } from "../contracts/governance-runtime";

export class AllianceMembershipPolicy
{
    public constructor(private readonly runtime: AlliancePolicyRuntime)
    {}

    public readonly allianceText = (value: string, min: number, max: number) => {
        const allianceFailure: (code?: string) => never = this.runtime.allianceFailure;

        if (
            typeof value !== "string"
            || value.length < min
            || value.length > max
            || !value.isWellFormed()
            || /[\p{C}<>&]/u.test(value)
        )
        {
            allianceFailure();
        }

        return value;
    };

    public readonly allianceMember = (rows: readonly Row[], owner: string, allianceId?: string) => {
        const { num, text, errors } = this.runtime;
        const allianceFailure: (code?: string) => never = this.runtime.allianceFailure;

        const row = rows.find(
            (row) => row.uid === owner && (!allianceId || row.allianceId === allianceId),
        );

        if (!row || !text(row, "allianceId") || num(row, "rank") < 1 || num(row, "rank") > 5)
        {
            allianceFailure(errors.locked);
        }

        return row;
    };

    public readonly allianceRight = (member: Row, rules: Rules, right: string) => {
        const { num, errors } = this.runtime;
        const allianceFailure: (code?: string) => never = this.runtime.allianceFailure;

        if (rules.alliance.ranks?.get(`710${num(member, "rank")}`)?.[right] !== "1")
        {
            allianceFailure(errors.locked);
        }
    };

    public readonly allianceTargets = (raw: string): string[] => {
        const allianceFailure: (code?: string) => never = this.runtime.allianceFailure;

        if (!raw)
        {
            return [];
        }

        let value: unknown;

        try
        {
            value = JSON.parse(raw);
        }
        catch
        {
            allianceFailure();
        }

        if (
            !Array.isArray(value)
            || value.length > 32
            || value.some((id) => typeof id !== "string" || !/^\d{1,10}$/.test(id))
        )
        {
            allianceFailure();
        }

        return value;
    };

    public readonly alliancePermissions = (raw: string) => {
        const allianceFailure: (code?: string) => never = this.runtime.allianceFailure;

        const defaults: Record<string, number> = Object.fromEntries(
            [0, 1, 2].flatMap((kind) => [1, 2].map((rank) => [`${kind}_${rank}`, 1])),
        );

        if (!raw)
        {
            return defaults;
        }

        let value: unknown;

        try
        {
            value = JSON.parse(raw);
        }
        catch
        {
            return allianceFailure();
        }

        if (!value || typeof value !== "object" || Array.isArray(value))
        {
            allianceFailure();
        }

        for (const [key, entry] of Object.entries(value))
        {
            if (!Object.hasOwn(defaults, key) || ![0, 1].includes(entry))
            {
                allianceFailure();
            }

            defaults[key] = entry;
        }

        return defaults;
    };

    public readonly changeAlliancePermissions = (member: Row, raw: string, changes: string) => {
        const { num, errors } = this.runtime;
        const allianceFailure: (code?: string) => never = this.runtime.allianceFailure;
        const { alliancePermissions } = this;

        if (num(member, "rank") !== 5)
        {
            allianceFailure(errors.locked);
        }

        const values = alliancePermissions(raw),
            parts = changes.split(";");

        if (!parts.length || parts.length > 6)
        {
            allianceFailure();
        }

        const seen = new Set<string>();

        for (const part of parts)
        {
            const [key, value, extra] = part.split(":");

            if (
                !key
                || !Object.hasOwn(values, key)
                || seen.has(key)
                || extra !== undefined
                || !["0", "1"].includes(value ?? "")
            )
            {
                allianceFailure();
            }

            seen.add(key);
            values[key] = Number(value);
        }

        return values;
    };

    public readonly newAllianceMember = (
        owner: string,
        allianceId: string,
        rank: number,
        now: bigint,
        previous?: Row,
    ): Row => {
        const { cityInteger, num } = this.runtime;

        return {
            uid: owner,
            allianceId,
            rank: cityInteger(rank, 1, 5),
            point: num(previous ?? {}, "point"),
            accPoint: num(previous ?? {}, "accPoint"),
            progress: 0,
            todaydonate: 0,
            todayprogress: 0,
            jointime: now,
            donateTime: 0n,
            donateCDTime: 0n,
            donateAvailable: 1,
            wood: 0,
            stone: 0,
            iron: 0,
            food: 0,
            silver: 0,
            gold: 0,
            yesterdayLogin: 0,
            fight: 0,
            playoffFight: 0,
        };
    };

    public readonly allianceCapacity = (alliance: Row, scienceEffect = 0) => {
        const { cityInteger, num } = this.runtime;

        return cityInteger(num(alliance, "maxMember") + Math.trunc(scienceEffect), 1, 2048);
    };

    public readonly allianceCreationCost = (rules: Rules, castle: number) => {
        const { cityInteger, errors } = this.runtime;
        const allianceFailure: (code?: string) => never = this.runtime.allianceFailure;

        const config = rules.items.get("alliance_cost");

        if (castle < cityInteger(config?.k8, 1))
        {
            allianceFailure(errors.locked);
        }

        return castle >= cityInteger(config?.k6, 1) ? 0n : BigInt(cityInteger(config?.k5, 1));
    };

    public readonly allianceJoinAllowed = (
        profile: Row,
        alliance: Row,
        members: readonly Row[],
        power: bigint,
        castle: number,
        capacity = this.allianceCapacity(alliance),
    ) => {
        const { text, num, long, errors } = this.runtime;
        const allianceFailure: (code?: string) => never = this.runtime.allianceFailure;

        if (
            text(profile, "allianceId")
            || members.some((row) => row.uid === profile.uid && text(row, "allianceId"))
            || members.filter((row) => row.allianceId === alliance.uid).length >= capacity
        )
        {
            allianceFailure(errors.full);
        }

        if (
            num(profile, "crossFightSrcServerId") > 0
            || power < long(alliance, "powerRestriction")
            || castle < num(alliance, "castleRestriction")
        )
        {
            allianceFailure(errors.locked);
        }
    };
}
