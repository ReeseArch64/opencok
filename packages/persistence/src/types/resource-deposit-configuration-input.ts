import type { ResourceType } from "../enums/resource-type";
import type { ResourceRespawnPolicy } from "../enums/resource-respawn-policy";
export type CreateResourceDepositConfiguration = {
    resourceType: ResourceType;
    resourceLevel: number;
    configurationVersion: number;
    initialQuantity: number;
    respawnPolicy: ResourceRespawnPolicy;
    respawnDelaySeconds?: number | null;
};
