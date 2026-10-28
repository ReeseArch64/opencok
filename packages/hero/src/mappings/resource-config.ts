import { validateFields } from "@opencok/messages/validations/fields";
import { heroResourceConfigSchema } from "@opencok/hero/validations/resource-config";
import { sfs, type Fields } from "@opencok/messages/sfs";

import { HERO_RESOURCE_VERSION, HERO_RESOURCE_ANDROID_MD5 } from "@opencok/constants/game";

export function heroResourceConfig(): Fields
{
    return validateFields(heroResourceConfigSchema, {
        newHeroVersion: sfs.string(HERO_RESOURCE_VERSION),
        newHeroMd5Android: sfs.string(HERO_RESOURCE_ANDROID_MD5),
    });
}
