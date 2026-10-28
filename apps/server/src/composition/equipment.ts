import { EquipmentDomain } from "@opencok/equipment/services/equipment";
import { WorkshopDomain } from "@opencok/equipment/services/workshop";
import { EquipmentPolicy } from "@opencok/equipment/rules/equipment";
import { EquipmentMapper } from "@opencok/equipment/mappings/equipment";
import { PublicEquipmentMapper } from "@opencok/equipment/mappings/public-equipment";
import type { EquipmentRuntime } from "@opencok/equipment/contracts/runtime";
import type { CityProgressionContext } from "@opencok/city/services/context";
import type { Rules } from "@opencok/rules/game";
import { text, num, long } from "@opencok/contracts/rows";
import {
    cityInteger,
    cityAmount,
    cityDuration,
    progressionActivityData,
} from "@opencok/rules/city-progression";
import { chooseWeight } from "@opencok/rules/weighted-choice";
import { idleDeadline } from "@opencok/rules/timed-activity";
import { integer } from "@opencok/mappings/profile-values";
import { queue as queueView } from "@opencok/mappings/city";
import { refreshQuests } from "@opencok/services/quests";

export function createRealmEquipmentPolicy()
{
    return new EquipmentPolicy({ text, num, cityInteger, cityAmount, chooseWeight });
}

export function createRealmEquipmentDomains()
{
    const policy = createRealmEquipmentPolicy();
    const mapper = new EquipmentMapper({ text, num }, new PublicEquipmentMapper({ text, integer }));
    const runtime: EquipmentRuntime<Rules, CityProgressionContext> = {
        text,
        num,
        long,
        cityInteger,
        cityAmount,
        cityDuration,
        progressionActivityData,
        chooseWeight,
        idleDeadline,
        queueView,
        refreshQuests,
    };
    return {
        equipment: new EquipmentDomain(runtime, policy, mapper),
        workshop: new WorkshopDomain(runtime, policy, mapper),
    };
}
