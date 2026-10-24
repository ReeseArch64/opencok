import type { Row } from "./rows.ts";

export interface AuthenticationStore {
  profile(uid: string): Promise<Row | undefined>;
  accounts(uid: string): Promise<Row[]>;
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
  configuration(uid: string): Promise<LoginConfigurationState>;
  city(uid: string, now: number): Promise<CityState>;
  world(
    uid: string,
    ids: number[],
  ): Promise<{ world: Row | undefined; points: Row[]; hasMarches: boolean }>;
}

export interface LoginConfigurationState {
  profile: Row | undefined;
  switches: Row[];
  pushSettings: Row[];
}

export interface GameServices {
  changeAccountCount?(deviceId: string): Promise<bigint | null>;
  featureAvailability?(profile: Row, now: number): Readonly<Record<string, boolean>>;
}
