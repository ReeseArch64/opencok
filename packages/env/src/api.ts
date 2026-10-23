import { loadEnvironment } from "./load";
import { parseApiEnvironment } from "./api.schema";
export const loadApiEnvironment = () => parseApiEnvironment(loadEnvironment(process.env));
export { apiSchema, type ApiEnvironment } from "./api.schema";
