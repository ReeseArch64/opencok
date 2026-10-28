import type { Fields } from "@opencok/messages/sfs";
import type { WorldService } from "../services/world";

export class WorldController
{
    constructor(private readonly worldService: Pick<WorldService, "get">)
    {}

    get(uid: string, params: Fields): Promise<Fields>
    {
        return this.worldService.get(uid, params);
    }
}
