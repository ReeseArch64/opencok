import { eq } from "drizzle-orm";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { long } from "@opencok/contracts/rows";
import { boxWords } from "@opencok/rules/ordinary-box";
import type { OrdinaryBoxWrite } from "@opencok/contracts/ordinary-box";
import type { MutationTransaction } from "./mutation";
export async function readOrdinaryBoxServer(tx: MutationTransaction) {
  const [row] = await tx.select().from(server_info).where(eq(server_info.uid, "server"));
  return { openedAt: long(row ?? {}, "activityTime") };
}
export async function writeOrdinaryBox(
  tx: MutationTransaction,
  owner: string,
  write: OrdinaryBoxWrite,
) {
  if (typeof write.gold !== "boolean") throw new Error("Invalid ordinary box payment mode");
  if (write.mdata !== undefined) boxWords(write.mdata);
  const value = {
    ordinaryBoxGold: write.gold ? 1 : 0,
    ...(write.mdata === undefined ? {} : { mdata: write.mdata }),
  };
  await tx
    .insert(user_mixed_info)
    .values({ uid: owner, mdata: "", ...value })
    .onConflictDoUpdate({ target: user_mixed_info.uid, set: value });
}
