import type { CreateCharacterDto } from "@opencok/dtos/provisioning";
import type { ProvisioningService } from "@opencok/services/provisioning";

export class ProvisioningController
{
    constructor(readonly service: ProvisioningService)
    {}

    create(token: string, input: CreateCharacterDto)
    {
        return this.service.create(token, input);
    }
}
