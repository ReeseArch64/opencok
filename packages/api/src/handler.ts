import type { ApiHandlerOptions } from "./api-handler-options.ts";
import { ApiRequestHandler } from "./api-request-handler.ts";
import { ApiRouter } from "./api-router.ts";

export function createHandler(
    accounts: ApiHandlerOptions["accounts"],
    directory: ApiHandlerOptions["directory"],
    redis: ApiHandlerOptions["redis"],
    chatDiscovery?: ApiHandlerOptions["chatDiscovery"],
    files?: ApiHandlerOptions["files"],
    provisioning?: ApiHandlerOptions["provisioning"],
): ApiRequestHandler
{
    return new ApiRequestHandler(
        new ApiRouter({ accounts, directory, redis, chatDiscovery, files, provisioning }),
    );
}
