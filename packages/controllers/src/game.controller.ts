import type { Fields } from "@opencok/messages/sfs";
import type { GameService, Result } from "@opencok/services/game";

export type { Result } from "@opencok/services/game";

export class GameController
{
    constructor(
        private readonly gameService: Pick<GameService, "initial" | "initialize" | "execute">,
    )
    {}

    initial(uid: string): Promise<Fields>
    {
        return this.gameService.initial(uid);
    }

    initialize(uid: string, correlation: Fields = {}, signal?: AbortSignal): Promise<Result>
    {
        return this.gameService.initialize(uid, correlation, signal);
    }

    execute(uid: string, command: string, params: Fields): Promise<Result>
    {
        return this.gameService.execute(uid, command, params);
    }
}
