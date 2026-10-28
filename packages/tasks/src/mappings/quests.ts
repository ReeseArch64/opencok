import { sfs, type Fields } from "@opencok/messages/sfs";
import type { QuestRecord as Row } from "../contracts/records";
import type { QuestRecordReaders } from "../contracts/runtime";
import { QuestKind } from "../enums/kind";

export class QuestMapper
{
    public constructor(private readonly runtime: Pick<QuestRecordReaders, "text" | "num">)
    {}

    public readonly questTask = (row: Row, kind: `${QuestKind}`): Fields => {
        const { text, num } = this.runtime;

        return {
            id: kind === QuestKind.Main ? sfs.string(text(row, "id")) : sfs.int(num(row, "id")),
            num: sfs.int(num(row, "num")),
            state: sfs.int(num(row, "state")),
            type: sfs.int(num(row, "type")),
        };
    };

    public readonly questTasks = (rows: readonly Row[], kind: `${QuestKind}`) => {
        return sfs.array(rows.map((row) => sfs.object(this.questTask(row, kind))));
    };
}
