import type { GameServices } from "@opencok/contracts/game";
import type { CityBootstrapResult } from "@opencok/contracts/city-bootstrap";
import type { ReconnectProgressState, ReconnectProgressWrite } from "@opencok/contracts/reconnect";
import type { RuleContext } from "@opencok/rules/availability";

export type CityBootstrapServices = Pick<
    GameServices,
    | "hotItemBusinessMan"
    | "cityProgression"
    | "reconcileAlliance"
    | "reconcileTimed"
    | "alliance"
    | "expeditionActivity"
    | "worldEffectBoard"
    | "reconnect"
>;

export interface CityBootstrapReconnect
{
    plan(state: ReconnectProgressState, context: RuleContext): Promise<{
        write: ReconnectProgressWrite;
        result: CityBootstrapResult;
    }>;
    validate(result: CityBootstrapResult, command: string): void;
}
