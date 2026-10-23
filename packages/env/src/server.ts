import { loadEnvironment } from "./load";
import { parseServerEnvironment } from "./server.schema";

export const loadServerEnvironment = () => parseServerEnvironment(loadEnvironment(process.env));
export { serverSchema, type ServerEnvironment } from "./server.schema";
