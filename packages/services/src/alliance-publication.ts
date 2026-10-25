import { decode, fields, str, sfs, type Fields } from "@opencok/messages/sfs";
import { text, num, long, type Row } from "@opencok/contracts/rows";
import type { AlliancePublicationSnapshot } from "@opencok/contracts/alliance-gameplay";
import { alliancePermissions, allianceTargets } from "@opencok/rules/alliance";
import { allianceScienceEffects } from "@opencok/rules/power-memberships";
import type { Rules } from "@opencok/rules/game";
import { allianceScienceRule, allianceScienceStage } from "@opencok/rules/alliance-science";
export async function publishAllianceMutation(
  read: (id: string, players?: readonly string[]) => Promise<AlliancePublicationSnapshot>,
  payload: Buffer,
  publish: (owner: string, command: string, body: Fields) => Promise<unknown>,
  rules: Rules,
) {
  const data = decode(payload),
    id = str(data, "allianceId"),
    command = str(data, "command");
  const changed = (data.members?.value ?? []) as { value: Fields }[];
  const snapshot = await read(
    id,
    changed.map((entry) => str(entry.value, "uid")),
  );
  for (const entry of changed) {
    const row = fields(sfs.object(entry.value));
    if (
      !str(row, "allianceId") &&
      snapshot.profiles.some(
        (profile) => profile.uid === str(row, "uid") && !text(profile, "allianceId"),
      )
    )
      await publish(str(row, "uid"), "push.al.leave", { allianceId: sfs.string(id) });
  }
  if (!snapshot.record) return;
  const record = snapshot.record,
    leader = snapshot.members.find((row) => row.rank === 5),
    effects = allianceScienceEffects(snapshot.sciences, rules);
  const scienceFields = (science: Row): Fields => {
    const rule = allianceScienceRule(rules, num(science, "scienceId"), num(science, "level")),
      stage = allianceScienceStage(rule, num(science, "donateprogress")),
      research = snapshot.research.find((row) => row.scienceId === science.scienceId);
    return {
      scienceId: sfs.int(num(science, "scienceId")),
      level: sfs.int(num(science, "level")),
      currentPro: sfs.int(stage.current),
      totalPro: sfs.int(num(science, "donateprogress")),
      needPro: sfs.int(stage.required),
      star: sfs.int(stage.stage + 1),
      para1: sfs.string(rule.para1 ?? ""),
      para2: sfs.string(rule.para2 ?? "0"),
      points: sfs.string(rule.points ?? "0"),
      nextPara2: sfs.string(
        rules.power.allianceSciences?.get(
          String(num(science, "scienceId") + num(science, "level") + 1),
        )?.para2 ?? "0",
      ),
      ...(research
        ? {
            startTime: sfs.long(long(research, "startTime")),
            finishTime: sfs.long(long(research, "startTime") + long(research, "needTime")),
          }
        : {}),
    };
  };
  for (const member of snapshot.members) {
    const info = {
      uid: sfs.string(id),
      alliancename: sfs.string(text(record, "alliancename")),
      abbr: sfs.string(text(record, "abbr")),
      intro: sfs.string(text(record, "intro")),
      announce: sfs.string(text(record, "announce")),
      member: sfs.int(snapshot.members.length),
      curMember: sfs.int(snapshot.members.length),
      maxMember: sfs.int(num(record, "maxMember") + Math.trunc(effects.get(500) ?? 0)),
      language: sfs.string(text(record, "language")),
      recruit: sfs.int(num(record, "recruit")),
      icon: sfs.string(text(record, "icon")),
      bannerStyle: sfs.string(text(record, "bannerStyle")),
      permission: sfs.object(
        Object.fromEntries(
          Object.entries(alliancePermissions(text(record, "permission"))).map(([key, value]) => [
            key,
            sfs.int(value),
          ]),
        ),
      ),
      targetScience: sfs.string(allianceTargets(text(record, "targetScience")).join(";")),
      ...Object.fromEntries(
        ["rankone", "ranktwo", "rankthree", "rankfour", "rankfive"].map((key) => [
          key,
          sfs.string(text(record, key)),
        ]),
      ),
      rank: sfs.int(num(member, "rank")),
      point: sfs.int(num(member, "point")),
      accPoint: sfs.int(num(member, "accPoint")),
      alliancepoint: sfs.long(long(record, "alliancepoint")),
      learderUid: sfs.string(leader ? text(leader, "uid") : ""),
      learderName: sfs.string(leader ? text(leader, "name") : ""),
    };
    await publish(text(member, "uid"), "push.al.update", { alliance: sfs.object(info) });
    if (
      command === "al.acceptapply" &&
      changed.some(
        (entry) => str(entry.value, "uid") === member.uid && str(entry.value, "allianceId") === id,
      )
    )
      await publish(text(member, "uid"), "push.al.join", {
        alliance: sfs.object({
          ...info,
          allianceScience: sfs.array(
            [...(rules.power.allianceSciences?.values() ?? [])]
              .filter((rule) => rule.science_lv === "0")
              .map((rule) =>
                sfs.object(
                  scienceFields(
                    snapshot.sciences.find((row) => num(row, "scienceId") === Number(rule.id)) ?? {
                      scienceId: Number(rule.id),
                      level: 0,
                      donateprogress: 0,
                    },
                  ),
                ),
              ),
          ),
        }),
      });
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
      for (const science of snapshot.sciences)
        await publish(text(member, "uid"), "push.al.science", {
          ...scienceFields(science),
          alliancepoint: sfs.long(long(record, "alliancepoint")),
        });
  }
}
