import {
    ownerInteger as integer,
    ownerText as text,
    ownerLong as long,
    ownerRecords as bounded,
} from "@opencok/services/world-resource-owner-values";
import type { WorldResourceOwnerSnapshot } from "@opencok/contracts/world-resource-owner";
import { legacyIntegerOrder, legacyObjectOrder } from "@opencok/messages/legacy-object-order";
import type { Rules } from "@opencok/rules/game";
import { validateNewGeneralContent } from "@opencok/hero/rules/new-general-effects";
import type {
    NewGeneralEquipment,
    NewGeneralEquippedState,
} from "@opencok/hero/rules/new-general-equipment";
import type { NewGeneralStatus } from "@opencok/hero/rules/new-general-status";

export function restoredResourceGenerals(
    snapshot: WorldResourceOwnerSnapshot["newGenerals"],
    rules: Rules,
): NewGeneralEquippedState[]
{
    if (typeof snapshot.moved !== "boolean")
    {
        throw new Error("Invalid general transfer state");
    }

    const ids: number[] = [];
    const selected = new Map<
        number,
        {
            general: NewGeneralEquippedState;
            statuses: NewGeneralStatus[];
            equipment: Map<string, NewGeneralEquipment>;
            slots: string[];
        }
    >();

    for (const row of bounded(snapshot.generals))
    {
        const state = integer(row.state);

        if (state < -128 || state > 127)
        {
            throw new Error("Invalid saved general byte");
        }

        const statuses: NewGeneralStatus[] = [];
        const general: NewGeneralEquippedState = {
            id: integer(row.id),
            state,
            buildingUuid: text(row.buildingUuid, 96),
            star: integer(row.star),
            baseSkill: text(row.baseSkill, 256),
            talent: text(row.talent, 5000),
            opTime: text(row.opTime, 200),
            refinement: text(row.refinement, 300),
            statuses,
            orderedEquipment: [],
        };
        validateNewGeneralContent(general);
        ids.push(general.id);
        selected.set(general.id, { general, statuses, equipment: new Map(), slots: [] });
    }

    if (!snapshot.moved)
    {
        for (const row of bounded(snapshot.statuses))
        {
            const entry = selected.get(integer(row.newGeneralId));

            if (!entry)
            {
                continue;
            }

            entry.statuses.push({
                stateId: integer(row.stateId),
                startTime: long(row.startTime),
                endTime: long(row.endTime),
            });
        }

        for (const row of bounded(snapshot.equipment))
        {
            const generalId = integer(row.generalId);

            if (generalId <= 0)
            {
                continue;
            }

            const entry = selected.get(generalId);

            if (!entry)
            {
                continue;
            }

            const itemId = integer(row.itemId);
            const rule = rules.power.equipment?.get(String(itemId));

            if (!rule)
            {
                throw new Error("Missing general equipment binding rule");
            }

            if (entry.general.state === 4)
            {
                continue;
            }

            if (typeof rule.site !== "string" || rule.site.length > 65535)
            {
                throw new Error("Missing or oversized general equipment site");
            }

            entry.slots.push(rule.site);
            entry.equipment.set(rule.site, {
                itemId,
                extraProperty: text(row.extraProperty, 255),
            });
        }
    }

    return legacyIntegerOrder(ids).map((id) => {
        const entry = selected.get(id)!;
        entry.general.orderedEquipment = legacyObjectOrder(entry.slots).map((site) =>
            entry.equipment.get(site)!
        );

        return entry.general;
    });
}
