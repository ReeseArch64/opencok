import { sfs, type Fields } from "@opencok/messages/sfs";
import { text, num, type Row } from "@opencok/contracts/rows";

export function questTask(row: Row, kind: "main" | "daily" | "story"): Fields
{
    return {
        id: kind === "main" ? sfs.string(text(row, "id")) : sfs.int(num(row, "id")),
        num: sfs.int(num(row, "num")),
        state: sfs.int(num(row, "state")),
        type: sfs.int(num(row, "type")),
    };
}

export function questTasks(rows: readonly Row[], kind: "main" | "daily" | "story")
{
    return sfs.array(rows.map((row) => sfs.object(questTask(row, kind))));
}
