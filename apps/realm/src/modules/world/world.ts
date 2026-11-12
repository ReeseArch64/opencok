import type { MapQuery, MapRegion } from "@opencok/contracts";
import terrain from "./terrain.json";

/** Read-only development kingdom. No character ownership or durable placement yet. */
export class World
{
    readonly id = 1;
    readonly columns = 1200;
    readonly rows = 1200;
    readonly name = "Reino de desenvolvimento";
    private readonly blockedTemplate = new Set(
        terrain.blocked.map(([x, y]) => `${x},${y}`),
    );
    private readonly objects: MapRegion["objects"] = [
        { id: 1, kind: 1, x: 570, y: 570, width: 2, height: 2, level: 1 },
        { id: 2, kind: 2, x: 567, y: 570, width: 1, height: 1, level: 1 },
        { id: 3, kind: 3, x: 573, y: 570, width: 1, height: 1, level: 1 },
    ];

    blocked(x: number, y: number): boolean
    {
        if (x < 1 || x > this.columns || y < 1 || y > this.rows)
        {
            return true;
        }
        if (x >= 596 && x <= 605 && y >= 596 && y <= 605)
        {
            return true;
        }
        // The client repeats this numeric 57x57 terrain template around (600,600).
        // Mud remains terrain; the central reserve, water, hills and scenery block.
        if (x >= 574 && x <= 626 && y >= 574 && y <= 626)
        {
            return false;
        }
        const mod = (n: number, size: number) => ((n % size) + size) % size;
        return this.blockedTemplate.has(
            `${mod(x - 600 + Math.floor(terrain.columns / 2), terrain.columns)},${
                mod(y - 600 + Math.floor(terrain.rows / 2), terrain.rows)
            }`,
        );
    }

    query(q: MapQuery): MapRegion
    {
        const result: MapRegion = {
            requestId: q.requestId,
            status: 0,
            kingdomId: q.kingdomId,
            name: this.name,
            columns: this.columns,
            rows: this.rows,
            objects: [],
            blocked: [],
        };
        if (
            q.kingdomId !== this.id
            || q.minX < 1
            || q.minY < 1
            || q.maxX > this.columns
            || q.maxY > this.rows
            || q.maxX < q.minX
            || q.maxY < q.minY
            || q.maxX - q.minX >= 64
            || q.maxY - q.minY >= 64
        )
        {
            return { ...result, status: 1 };
        }
        result.objects = this.objects
            .filter(
                (o) =>
                    o.x <= q.maxX
                    && o.y <= q.maxY
                    && o.x + o.width - 1 >= q.minX
                    && o.y + o.height - 1 >= q.minY,
            )
            .map((o) => ({ ...o }));
        for (let y = q.minY; y <= q.maxY; y++)
        {
            for (let x = q.minX; x <= q.maxX; x++)
            {
                if (this.blocked(x, y))
                {
                    result.blocked.push({ x, y });
                }
            }
        }
        return result;
    }
}
