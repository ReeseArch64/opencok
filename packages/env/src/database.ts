import { loadEnvironment } from "./load";
import { parseDatabaseEnvironment, type DatabaseEnvironment } from "./database.schema";
import { requireEnvironment } from "./validation";

/** Database settings only, loaded from the same root file as general settings. */
export const env = parseDatabaseEnvironment(loadEnvironment(process.env));
export function requireEnv<K extends keyof DatabaseEnvironment>(key: K): NonNullable<DatabaseEnvironment[K]> {
  return requireEnvironment(env, key);
}
export { EnvironmentError } from "./validation";
export { databaseSchema, type DatabaseEnvironment } from "./database.schema";
export { rootEnvPath } from "./load";
