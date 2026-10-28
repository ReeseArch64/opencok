import { ResearchMapper } from "@opencok/research/mappings/research";
import type { ReconnectResearchProjection } from "@opencok/contracts/reconnect";
import { GameService } from "@opencok/services/game";
import { CityBootstrapService } from "@opencok/city/services/bootstrap";
import { CityBootstrapMapper } from "@opencok/city/mappings/bootstrap";
import {
    planReconnectProgress,
    validateReconnectResult,
} from "@opencok/services/reconnect-progress";
import { serverFeature } from "@opencok/rules/power-context";

export function createRealmGameService(
    db: ConstructorParameters<typeof GameService>[0],
    rules: ConstructorParameters<typeof GameService>[1],
    config: ConstructorParameters<typeof GameService>[2],
    now = Date.now,
    services: ConstructorParameters<typeof GameService>[4] = {},
    heroes?: ConstructorParameters<typeof GameService>[5],
): GameService
{
    const research = new ResearchMapper();
    const projectResearch: ReconnectResearchProjection = (rows, queues) =>
        research.data(rows, queues, rules);

    return new GameService(
        db,
        rules,
        config,
        now,
        services,
        heroes,
        (hooks) =>
            new CityBootstrapService(
                db,
                config,
                now,
                services,
                hooks,
                new CityBootstrapMapper(rules, now, {
                    kingdomId: config.kingdomId,
                    features: hooks.features,
                    hasReconnect: () => Boolean(services.reconnect),
                }, research),
                {
                    plan: (progress, context) =>
                        planReconnectProgress(
                            progress,
                            rules,
                            context,
                            services,
                            {
                                specialServer: serverFeature(rules, "araf_mode", context),
                                cn1: null,
                                research: projectResearch,
                            },
                        ),
                    validate: validateReconnectResult,
                },
            ),
        projectResearch,
    );
}
