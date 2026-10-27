import type { CharacterProvisioningService } from "@opencok/services/provisioning";
import type { CharacterReservation } from "@opencok/contracts/provisioning";

export class CharacterProvisioningController {
  constructor(readonly service: CharacterProvisioningService) {}

  create(input: CharacterReservation) {
    return this.service.create(input);
  }
}
