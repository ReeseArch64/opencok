import type { ActivityDirectoryEntryResponse } from "@opencok/contracts/responses/activity-directory";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { activityDirectorySchema } from "@opencok/validations/activity-directory";
import { validateFields } from "./validation";

export function activityDirectory(entries: readonly ActivityDirectoryEntryResponse[]): Fields {
  return validateFields(activityDirectorySchema, {
    act: sfs.array(
      entries.map((entry) => {
        const fields: Fields = { t: sfs.int(entry.t) };

        for (const key of ["opt", "st", "et"] as const)
          {if (entry[key] !== undefined) {fields[key] = sfs.int(entry[key]);}}

        return sfs.object(fields);
      }),
    ),
  });
}
