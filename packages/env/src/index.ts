import { loadEnvironment } from "./load";
import { parseEnvironment, type Environment } from "./schema";
import { requireEnvironment } from "./validation";

export const env = parseEnvironment(loadEnvironment(process.env));
export function requireEnv<K extends keyof Environment>(key: K): NonNullable<Environment[K]> {
  return requireEnvironment(env, key);
}
export { EnvironmentError } from "./validation";
export { environmentSchema, type Environment } from "./schema";
