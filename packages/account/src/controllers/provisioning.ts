import type { CreateCharacterDto } from "../dtos/create-character.dto";
import type { ProvisioningService } from "../services/provisioning";

export class ProvisioningController
{
    constructor(readonly service: ProvisioningService)
    {}

    create(token: string, input: CreateCharacterDto)
    {
        return this.service.create(token, input);
    }
}
