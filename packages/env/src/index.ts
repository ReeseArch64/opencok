import { loadEnvironment } from "./load";
export { rootEnvPath } from "./load";
import { requireEnvironment, type Environment } from "./schema";

/** Server configuration: one root file plus explicitly injected process/CI overrides. */
export const env = loadEnvironment(process.env);
export function requireEnv<K extends keyof Environment>(key: K): NonNullable<Environment[K]> {
  return requireEnvironment(env, key);
}
export { EnvironmentError, type Environment } from "./schema";
