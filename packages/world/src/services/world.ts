import { compactPoint, pointSections } from "../mappings/world-map";
import { viewport } from "../rules/viewport";
import type { WorldMapStore, WorldMapLive, WorldPointProjections } from "../contracts/runtime";
import { long, num } from "../contracts/rows";
import { int, sfs, str, type Fields } from "@opencok/messages/sfs";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

export class WorldService
{
    constructor(
        readonly db: WorldMapStore,
        readonly size: number,
        readonly kingdomId: number,
        readonly projections: WorldPointProjections,
        readonly live?: WorldMapLive,
    )
    {}

    async get(uid: string, params: Fields): Promise<Fields>
    {
        const x = int(params, "x");
        const y = int(params, "y");
        const mode = int(params, "type", 0);

        if (x < 0 || y < 0 || x >= this.size || y >= this.size || ![0, 1, 2].includes(mode))
        {
            throw new GameError(errors.invalid);
        }

        if (
            int(params, "serverId", this.kingdomId) !== this.kingdomId
            || params.guide
            || str(params, "extendMarchUuid", "")
        )
        {
            throw new GameError(errors.unsupported);
        }

        const ids = mode ? [1 + x + y * this.size] : viewport(x, y, this.size);
        const { world, points, hasMarches, cosmetics } = await this.db.getWorldByPointIds(uid, ids);

        if (!world || num(world, "worldId") !== 0 || (hasMarches && !this.live))
        {
            throw new GameError(errors.unsupported);
        }

        const byId = new Map(points.map((row) => [num(row, "id"), row]));
        const compact = ids
            .filter((id) => byId.has(id))
            .map((id) =>
                compactPoint(
                    byId.get(id)!,
                    cosmetics?.filter((row) => row.uid === byId.get(id)!.ownerId),
                    this.projections,
                    BigInt(this.live?.now?.() ?? Date.now()),
                )
            );
        await this.live?.subscribe(uid, x, y);
        const marches = this.live ? await this.live.marches(ids) : [];

        if (marches.length > 1024)
        {
            throw new GameError(errors.unsupported);
        }

        return {
            ...pointSections(compact),
            m: sfs.array(
                marches.map((row) =>
                    sfs.object(
                        this.live!.projectMarch(row),
                    )
                ),
            ),
            serverId: sfs.int(this.kingdomId),
            x: sfs.int(x),
            y: sfs.int(y),
            timeStamp: sfs.int(int(params, "timeStamp")),
            moveCityTime: sfs.long(long(world, "lastMoveCityTime")),
        };
    }
}
