import type { QuestRecord as Row } from "../contracts/records";
import type { QuestRecordReaders } from "../contracts/runtime";

export class QuestChanges
{
    public constructor(private readonly runtime: Pick<QuestRecordReaders, "num">)
    {}

    public readonly changedQuestRows = (
        rows: readonly Row[] | undefined,
        before: readonly Row[] = [],
        daily = false,
    ): readonly Row[] | undefined => {
        const { num } = this.runtime;

        if (!rows)
        {
            return;
        }

        const key = (row: Row) => JSON.stringify([String(row.id), daily ? num(row, "type") : 0]);
        const previous = new Map(before.map((row) => [key(row), row]));
        const unique = new Map(rows.map((row) => [key(row), row]));

        return [...unique.values()].filter((row) => {
            const old = previous.get(key(row));

            return (
                !old
                || ["uid", "type", "state", "num", "times"].some((field) =>
                    field === "uid"
                        ? old[field] !== row[field]
                        : num(old, field) !== num(row, field)
                )
            );
        });
    };
}
