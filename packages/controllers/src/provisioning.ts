import type { CreateCharacterDto } from "@opencok/dtos/provisioning";
import type {
  ProvisioningService,
  CharacterProvisioningService,
} from "@opencok/services/provisioning";
import type { CharacterReservation } from "@opencok/contracts/provisioning";

export class ProvisioningController {
  constructor(readonly service: ProvisioningService) {}
  create(token: string, input: CreateCharacterDto) {
    return this.service.create(token, input);
  }
}
export class CharacterProvisioningController {
  constructor(readonly service: CharacterProvisioningService) {}
  create(input: CharacterReservation) {
    return this.service.create(input);
  }
}
