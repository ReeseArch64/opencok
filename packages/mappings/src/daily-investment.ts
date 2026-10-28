import type { DailyInvestmentResponse } from "@opencok/contracts/responses/daily-investment";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { dailyInvestmentSchema } from "@opencok/validations/daily-investment";
import { validateFields } from "@opencok/messages/validations/fields";

export function dailyInvestmentView(row: DailyInvestmentResponse): Fields
{
    return validateFields(dailyInvestmentSchema, {
        id_table: sfs.int(row.id_table),
        id_receive: sfs.string(row.id_receive),
        ...(row.interval_day === undefined ? {} : { interval_day: sfs.int(row.interval_day) }),
        ...(row.gold === undefined ? {} : { gold: sfs.int(row.gold) }),
    });
}
