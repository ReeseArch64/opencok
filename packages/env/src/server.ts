import { loadEnvironment } from "./load";
import { parseServerEnvironment } from "./server.schema";

// Keep service-specific requirements out of offline tools and other services.
export const loadServerEnvironment = () => parseServerEnvironment(loadEnvironment(process.env));
export { serverSchema, type ServerEnvironment } from "./server.schema";
