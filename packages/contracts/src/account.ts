export interface Account {
  gameUid: string;
  server: string;
  uuid: string;
  gameUserLevel: string;
  active: string | null;
  lastTime: string;
}
export interface AccountReader {
  valid(type: string, value: string, bound: boolean): Promise<Account[]>;
}
