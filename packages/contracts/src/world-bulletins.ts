export interface WorldBulletinStore {
  alliance(observer: string, kingdomId: number, now: number): Promise<string | undefined>;
}

export type WorldBulletinReader = (
  alliance: string,
  start: number,
  end: number,
) => Promise<readonly string[]>;

export interface WorldBulletinArchive {
  store: WorldBulletinStore;
  page: WorldBulletinReader;
}
