import { decode, str, int, sfs, fields, type Fields } from "@opencok/messages/sfs";
export async function publishWorldMutation(
  payload: Buffer,
  command: string,
  _kingdomId: number,
  interested: (
    points: readonly number[],
    owner: string,
    target: string,
  ) => Promise<readonly string[]>,
  publish: (owner: string, command: string, body: Fields) => Promise<unknown>,
) {
  const body = decode(payload),
    owner = str(body, "owner"),
    marches = (body.marches?.value ?? []) as { value: Fields }[],
    points = (body.points?.value ?? []) as { value: Fields }[],
    deleted = (body.deleted?.value ?? []) as { value: string }[];
  const pointIds = [
    int(body, "origin"),
    int(body, "target", 0),
    ...marches.flatMap((row) => [int(row.value, "sp"), int(row.value, "dp")]),
    ...points.map((row) => int(row.value, "id")),
  ].filter((id) => id > 0);
  for (const push of (body.ownerPushes?.value ?? []) as { value: Fields }[]) {
    const name = str(push.value, "command");
    if (
      ![
        "push.petdragon.march",
        "push.general.info",
        "push.item.del",
        "push.world.march.win",
      ].includes(name)
    )
      throw new Error("Invalid world owner notification");
    await publish(owner, name, fields(push.value.body));
  }
  const recipients = await interested(pointIds, owner, "");
  for (const recipient of recipients.filter(Boolean)) {
    for (const totem of (body.totems?.value ?? []) as { value: Fields }[])
      await publish(recipient, "push.totem.change.info", totem.value);
    for (const march of marches)
      await publish(
        recipient,
        command === "world.march.spd"
          ? "push.world.march.spd"
          : command === "world.march.retreat"
            ? "push.world.march.retreat"
            : "push.world.march",
        march.value,
      );
    for (const entry of deleted)
      await publish(recipient, "push.world.march.del", { uuid: sfs.string(entry.value) });
    for (const point of points) {
      await publish(recipient, "push.world.point", { id: point.value.id! });
      if (
        (command === "world.mv" || command === "world.mv.gold") &&
        (int(point.value, "pointType") === 1 || int(point.value, "id") === int(body, "origin"))
      )
        await publish(recipient, "push.world.mv", {
          i: point.value.id!,
          t: point.value.pointType!,
          o: sfs.string(str(point.value, "name", "")),
          l: point.value.level ?? sfs.int(0),
          time: point.value.shield ?? sfs.long(0n),
          oc: sfs.int(1),
        });
    }
  }
}
