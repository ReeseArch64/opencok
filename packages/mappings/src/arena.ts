import { num, long, text, type Row } from "@opencok/contracts/rows";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { arenaInfoSchema, arenaArmySchema } from "@opencok/validations/arena";
import { validateFields } from "@opencok/messages/validations/fields";

export function arenaInfo(row: Row): Fields
{
    return validateFields(arenaInfoSchema, {
        state: sfs.int(num(row, "state")),
        rankScore: sfs.int(num(row, "rankScore")),
        time: sfs.long(long(row, "time")),
    });
}

export function arenaArmy(rows: readonly Row[]): Fields
{
    return validateFields(arenaArmySchema, {
        armyArray: sfs.array(
            rows.map((row) =>
                sfs.object({
                    armyId: sfs.string(text(row, "armyId")),
                    count: sfs.int(num(row, "free")),
                })
            ),
        ),
    });
}
