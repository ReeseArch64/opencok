import { type Fields } from "@opencok/messages/sfs";
import { sfs } from "@opencok/messages/sfs";
import { long, num, text, type Row } from "../contracts/rows";
import type { WorldPointProjections } from "../contracts/runtime";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

export function compactPoint(
    row: Row,
    cosmetics: readonly Row[] = [],
    projections: WorldPointProjections,
    now = BigInt(Date.now()),
    alliances: ReadonlyMap<string, Row> = new Map(),
): string
{
    if (
        ![0, 1, 2, 3, 6, 7, 8, 9, 10, 11, 12, 13, 15, 17, 37, 38, 44, 45, 48, 64, 65, 68, 69]
            .includes(
                num(row, "pointType"),
            )
        || text(row, "territoryAlliance")
    )
    {
        throw new GameError(errors.unsupported);
    }

    const out: Record<string, unknown> = {
        i: num(row, "id"),
        t: num(row, "pointType"),
        l: num(row, "resLevel"),
        v: num(row, "resInitValue") - num(row, "resCostValue"),
    };

    if (row.pointItem != null)
    {
        out.t1 = text(row, "pointItem");
    }

    if (row.ownerName != null)
    {
        out.o = text(row, "ownerName");
    }

    if (text(row, "ownerId"))
    {
        out.oid = text(row, "ownerId");
    }

    const allianceId = text(row, "allianceId");

    if (allianceId)
    {
        out.ai = allianceId;
        const alliance = alliances.get(allianceId);

        if (alliance && alliance.abbr != null)
        {
            out.asn = text(alliance, "abbr");
        }
    }

    if (out.t === 1 && Number(out.l) > 30)
    {
        out.sl = Number(out.l) - 30;
        out.l = 30;
    }

    for (
        const [output, input] of Object.entries({
            pt: "shieldTime",
            pt_resource: "resourceShieldTime",
            ft: "fireTime",
            rt: "flushTime",
            st: "startTime",
        })
    )
    {
        out[output] = Number(BigInt.asIntN(32, long(row, input) / 1000n));
    }

    if (out.t === 1)
    {
        const until = long(row, "sendHeartDurationTime");

        if (until !== 0n)
        {
            out.sendHeartDurationTime = Number(BigInt.asIntN(32, until));
        }

        if (text(row, "heartType"))
        {
            out.heartType = text(row, "heartType");
        }
    }

    if (out.t === 1)
    {
        Object.assign(out, projections.cosmetics(cosmetics, now));
    }

    Object.assign(out, projections.monster(row));

    return JSON.stringify(out);
}

export function pointSections(points: string[]): Fields
{
    const sections: string[] = [];
    let section: Record<string, unknown>[] = [];

    for (const point of points)
    {
        if (Buffer.byteLength(point) > 15000)
        {
            throw new GameError(errors.unsupported);
        }

        let value: unknown;

        try
        {
            value = JSON.parse(point);
        }
        catch
        {
            throw new GameError(errors.unsupported);
        }

        if (!value || typeof value !== "object" || Array.isArray(value))
        {
            throw new GameError(errors.unsupported);
        }

        if (Buffer.byteLength(JSON.stringify([...section, value])) > 31000)
        {
            sections.push(JSON.stringify(section));
            section = [];
        }

        section.push(value as Record<string, unknown>);
    }

    if (section.length || !sections.length)
    {
        sections.push(JSON.stringify(section));
    }

    return { section: sfs.int(sections.length), points: sfs.array(sections.map(sfs.string)) };
}
