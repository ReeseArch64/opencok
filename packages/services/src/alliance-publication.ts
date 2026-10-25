import { decode, fields, str, sfs, type Fields } from "@opencok/messages/sfs";
import { text, num, long } from "@opencok/contracts/rows";
import type { AlliancePublicationSnapshot } from "@opencok/contracts/alliance-gameplay";
export async function publishAllianceMutation(
  read: (id: string) => Promise<AlliancePublicationSnapshot>,
  payload: Buffer,
  publish: (owner: string, command: string, body: Fields) => Promise<unknown>,
) {
  const data = decode(payload),
    id = str(data, "allianceId"),
    command = str(data, "command");
  const snapshot = await read(id);
  const changed = (data.members?.value ?? []) as { value: Fields }[];
  for (const entry of changed) {
    const row = fields(sfs.object(entry.value));
    if (!str(row, "allianceId"))
      await publish(str(row, "uid"), "push.al.leave", { allianceId: sfs.string(id) });
  }
  if (!snapshot.record) return;
  const record = snapshot.record,
    leader = snapshot.members.find((row) => row.rank === 5);
  for (const member of snapshot.members) {
    const info = {
      uid: sfs.string(id),
      alliancename: sfs.string(text(record, "alliancename")),
      abbr: sfs.string(text(record, "abbr")),
      intro: sfs.string(text(record, "intro")),
      announce: sfs.string(text(record, "announce")),
      member: sfs.int(snapshot.members.length),
      curMember: sfs.int(snapshot.members.length),
      maxMember: sfs.int(num(record, "maxMember")),
      rank: sfs.int(num(member, "rank")),
      point: sfs.int(num(member, "point")),
      accPoint: sfs.int(num(member, "accPoint")),
      alliancepoint: sfs.long(long(record, "alliancepoint")),
      learderUid: sfs.string(leader ? text(leader, "uid") : ""),
      learderName: sfs.string(leader ? text(leader, "name") : ""),
    };
    await publish(text(member, "uid"), "push.al.update", { alliance: sfs.object(info) });
    if (command.startsWith("al.leader."))
      await publish(text(member, "uid"), "push.al.leader.trans", { alliance: sfs.object(info) });
    if (command === "al.callhelp" || command === "al.renderhelp" || command === "al.helpall")
      for (const help of snapshot.helps) {
        const active = snapshot.queues.find(
          (queue) => queue.uuid === help.content && queue.ownerId === help.senderId,
        );
        if (!active) continue;
        await publish(
          text(member, "uid"),
          command === "al.callhelp" ? "push.al.help.new" : "push.al.help.update",
          {
            helpId: sfs.string(text(help, "helpId")),
            senderId: sfs.string(text(help, "senderId")),
            content: sfs.string(text(help, "content")),
            queueId: sfs.string(text(help, "content")),
            updateTime: sfs.long(long(active, "updateTime")),
            maxcount: sfs.int(num(help, "maxcount")),
            nowcount: sfs.int(num(help, "nowcount")),
            maxCount: sfs.int(num(help, "maxcount")),
            nowCount: sfs.int(num(help, "nowcount")),
            qType: sfs.int(num(help, "type")),
            itemId: sfs.string(text(help, "itemId")),
            level: sfs.int(num(help, "level")),
            isvalid: sfs.int(num(help, "isvalid")),
          },
        );
      }
    if (command.startsWith("al.science.") || command === "alliance.tick")
      for (const science of snapshot.sciences) {
        const research = snapshot.research.find((row) => row.scienceId === science.scienceId);
        await publish(text(member, "uid"), "push.al.science", {
          scienceId: sfs.int(num(science, "scienceId")),
          level: sfs.int(num(science, "level")),
          totalPro: sfs.int(num(science, "donateprogress")),
          alliancepoint: sfs.long(long(record, "alliancepoint")),
          ...(research
            ? {
                startTime: sfs.long(long(research, "startTime")),
                finishTime: sfs.long(long(research, "startTime") + long(research, "needTime")),
              }
            : {}),
        });
      }
  }
}
