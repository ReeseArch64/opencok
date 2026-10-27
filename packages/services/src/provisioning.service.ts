import type { CreateCharacterDto } from "@opencok/dtos/provisioning";
import type {
  CharacterResponse,
  IdentityVerifier,
  ProvisioningStore,
  RealmProvisioner,
} from "@opencok/contracts/provisioning";
import {
  createCharacterSchema,
  reservationSchema,
  provisionReceiptSchema,
} from "@opencok/validations/provisioning";
import { HttpError } from "@opencok/errors/http";

export class ProvisioningService {
  constructor(
    readonly identities: IdentityVerifier,
    readonly store: ProvisioningStore,
    readonly realms: ReadonlyMap<number, RealmProvisioner>,
  ) {}
  async create(token: string, input: CreateCharacterDto): Promise<CharacterResponse> {
    const selected = createCharacterSchema.safeParse(input);
    if (!selected.success) throw new HttpError(400, "Invalid character input");
    const realm = this.realms.get(selected.data.kingdomId);
    if (!realm) throw new HttpError(400, "Realm unavailable");
    const identity = await this.identities.verify(token);
    const reserved = await this.store.reserve(identity, selected.data);
    const reservation = reservationSchema.parse(reserved.reservation);
    if (reserved.ready)
      return { gameUid: reservation.gameUid, kingdomId: reservation.kingdomId, state: "ready" };
    let receipt;
    try {
      receipt = provisionReceiptSchema.parse(await realm.create(reservation));
    } catch {
      return { gameUid: reservation.gameUid, kingdomId: reservation.kingdomId, state: "pending" };
    }
    return this.store.activate(identity, reservation, receipt);
  }
}
