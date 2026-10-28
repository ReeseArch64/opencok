import type { EquipmentRecord as Row } from "../contracts/equipment";
import type { EquipmentProjectionRuntime } from "../contracts/runtime";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { validateFields } from "@opencok/messages/validations/fields";
import { publicEquipmentSchema } from "../validations/equipment-preview";

export class PublicEquipmentMapper
{
    public constructor(
        private readonly runtime: Pick<EquipmentProjectionRuntime, "integer" | "text">,
    )
    {}

    private readonly serializePublicEquipment = (row: Row, strengthen: boolean): Fields => {
        const { integer, text } = this.runtime;

        const fields: Fields = {
            uuid: sfs.string(text(row, "uuid")),
            itemId: sfs.string(String(integer(row, "itemId"))),
            on: sfs.int(integer(row, "on")),
            extraProperty: sfs.string(text(row, "extraProperty")),
            refineProperty: sfs.string(text(row, "refineProperty")),
            reforgeCount: sfs.int(integer(row, "reforgeCount")),
        };

        if (strengthen)
        {
            fields.strength_level = sfs.int(integer(row, "strengthLevel"));
            fields.suit_effect = sfs.string("2-2910#4-774#6-756#8-68#10-69");
            fields.suit_value = sfs.string("2-6.5536#4-6.5536#6-655.36#8-13.1072#10-13.1072");
            fields.suit_value_type = sfs.string("2-0#4-0#6-0#8-1#10-1");
            fields.suit_value_sign = sfs.string("2-2#4-2#6-2#8-1#10-1");

            for (const key of ["Buff", "buff", "buff_str", "buff_Str", "buffStr", "BuffStr"])
            {
                fields[key] = sfs.string("50");
            }
        }

        if (row.lockProperty !== null && row.lockProperty !== undefined)
        {
            const raw = text(row, "lockProperty");
            const segments = raw.split("|");

            if (raw)
            {
                while (segments.at(-1) === "")
                {
                    segments.pop();
                }
            }

            let locks = "";

            for (const segment of segments)
            {
                const parts = segment.split(",");

                while (parts.at(-1) === "" && parts.length > 1)
                {
                    parts.pop();
                }

                if (parts.length < 2)
                {
                    throw new GameError(errors.unsupported, "public_profile");
                }

                if (parts[1] === "1")
                {
                    locks += (locks ? "|" : "") + parts[0]!;
                }
            }

            fields.lockProperty = sfs.string(locks);
        }

        return fields;
    };

    public readonly publicEquipment = (row: Row, strengthen: boolean): Fields => {
        return validateFields(
            publicEquipmentSchema,
            this.serializePublicEquipment(row, strengthen),
        );
    };
}
