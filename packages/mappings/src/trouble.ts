import { sfs, type Fields } from "@opencok/messages/sfs";
import { long, text, type Row } from "@opencok/contracts/rows";
export function troubleHistory(rows: readonly Row[]): Fields {
  if (rows.length > 10) throw new Error("Trouble history exceeds bound");
  return {
    array: sfs.array(
      rows.map((row) =>
        sfs.object({
          stateid: sfs.string(text(row, "statusid")),
          username: sfs.string(text(row, "username")),
          usetime: sfs.long(long(row, "usetime")),
          itemid: sfs.string(text(row, "itemid")),
        }),
      ),
    ),
  };
}
