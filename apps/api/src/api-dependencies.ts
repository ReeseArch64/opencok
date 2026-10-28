import { Context } from "effect";
import type { ApiHandlerOptions } from "@opencok/api/api-handler-options";

export class ApiDependencies extends Context.Service<ApiDependencies, ApiHandlerOptions>()(
    "@opencok/api/Dependencies",
)
{}
