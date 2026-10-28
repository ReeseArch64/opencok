import { num, long, text, type Row } from "@opencok/contracts/rows";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { lotteryInfoSchema } from "@opencok/validations/lottery";
import { validateFields } from "@opencok/messages/validations/fields";

export function lotteryInfo(row: Row, display?: string): Fields
{
    const [normal, superMode] = text(row, "lotteryInfo1").split(";");
    const body: Fields = {
        type: sfs.int(num(row, "type")),
        supermode: sfs.int(num(row, "superMode")),
        times1: sfs.int(num(row, "times1")),
        times2: sfs.int(num(row, "times2")),
        boxTimes: sfs.int(num(row, "boxTimes")),
        normal: sfs.string(normal ?? ""),
        super: sfs.string(superMode ?? ""),
        updatetime: sfs.long(long(row, "updateTime")),
    };

    if (num(row, "type") === 2)
    {
        if (display)
        {
            body.lotteryInfo = sfs.string(display);
        }

        if (num(row, "step") > 0)
        {
            const slots = text(row, "lotteryInfo2").split("|");
            body.rewards = sfs.string(
                text(row, "result")
                    .split("|")
                    .map((pair) => {
                        const [index, position] = pair.split(":");

                        return `${slots[Number(index) - 1]}:${position}`;
                    })
                    .join("|"),
            );
        }
    }

    return validateFields(lotteryInfoSchema, body);
}
