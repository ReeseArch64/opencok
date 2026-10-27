import type { Fields } from "@opencok/messages/sfs";

export const realmSocialPath = "/_internal/social";

export interface RealmSocialRequest {
  owner: string;
  realm: number;
  command: string;
  operationId: string;
  params: string;
}

export type RealmSocialExecutor = (
  owner: string,
  command: string,
  params: Fields,
) => Promise<Fields>;

export interface RealmSocialCommandService {
  execute(
    owner: string,
    realm: number,
    command: string,
    params: Record<string, unknown>,
    operationId: string,
  ): Promise<Record<string, unknown>>;
}
