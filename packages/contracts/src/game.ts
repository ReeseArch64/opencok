import type { Row } from "./rows.ts";
import type { PowerState } from "./power.ts";

export interface AuthenticationStore {
  getProfileById(uid: string): Promise<Row | undefined>;
  getAccountsByPlayerId(uid: string): Promise<Row[]>;
}
export interface CityState {
  profile: Row | undefined;
  resource: Row | undefined;
  buildings: Row[];
  queues: Row[];
  world: Row | undefined;
  hasMarches: boolean;
  armies: Row[];
  items: Row[];
  lord: Row | undefined;
}
export interface GameStore extends AuthenticationStore {
  getPowerByPlayerId(uid: string, now: number): Promise<PowerState>;
  getPlayerSummariesByIds(uids: string[], allServers: boolean): Promise<PlayerSummary[]>;
  getConfigurationByPlayerId(uid: string): Promise<LoginConfigurationState>;
  getCityByPlayerId(uid: string, now: number): Promise<CityState>;
  getWorldByPointIds(
    uid: string,
    ids: number[],
  ): Promise<{ world: Row | undefined; points: Row[]; hasMarches: boolean }>;
}

export interface PlayerSummary {
  data: Row;
  kingdomId: number;
  remote: boolean;
}

export interface LoginConfigurationState {
  profile: Row | undefined;
  switches: Row[];
  pushSettings: Row[];
}

export interface GameServices {
  playerUpdateTimes?(kingdomId: number, uids: string[]): Promise<ReadonlyMap<string, string>>;
  changeAccountCount?(deviceId: string): Promise<bigint | null>;
  featureAvailability?(profile: Row, now: number): Readonly<Record<string, boolean>>;
}
