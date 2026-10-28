import { decode, fields, str, sfs, type Fields } from "@opencok/messages/sfs";
import type { AllianceRecord as Row } from "../contracts/records";
import type { AlliancePublicationReader, AlliancePublisher } from "../contracts/publication";
import type { AlliancePublicationRuntime } from "../contracts/publication-runtime";
import type { AllianceScienceCatalog } from "../contracts/science-catalog";
import { AlliancePublicationMapper } from "../mappings/publication";
import type { AllianceHelpMapper } from "../mappings/help";
import type { AllianceScienceMapper } from "../mappings/science";
import { AlliancePublicationPush, AlliancePublicationTrigger } from "../enums/publication";
import { AllianceApplicationCommand } from "../enums/application-command";
import { AllianceHelpCommand, AllianceHelpPush } from "../enums/help-command";
import { AllianceSciencePush } from "../enums/science-command";

export class AlliancePublicationService
{
    public constructor(
        private readonly read: AlliancePublicationReader,
        private readonly publish: AlliancePublisher,
        private readonly rules: AllianceScienceCatalog,
        private readonly runtime: AlliancePublicationRuntime,
        private readonly mapper: AlliancePublicationMapper,
        private readonly helpMapper: Pick<AllianceHelpMapper, "publication">,
        private readonly scienceMapper: Pick<AllianceScienceMapper, "publication">,
    )
    {}

    public async deliver(payload: Buffer)
    {
        const { read, publish, rules } = this;
        const { text } = this.runtime;
        const data = decode(payload),
            id = str(data, "allianceId"),
            command = str(data, "command");
        const changed = (data.members?.value ?? []) as { value: Fields; }[];
        const snapshot = await read(
            id,
            changed.map((entry) => str(entry.value, "uid")),
        );

        for (const entry of changed)
        {
            const row = fields(sfs.object(entry.value));

            if (
                !str(row, "allianceId")
                && snapshot.profiles.some(
                    (profile) => profile.uid === str(row, "uid") && !text(profile, "allianceId"),
                )
            )
            {
                await publish(
                    str(row, "uid"),
                    AlliancePublicationPush.Leave,
                    this.mapper.leave(id),
                );
            }
        }

        if (!snapshot.record)
        {
            return;
        }

        if (command === AlliancePublicationTrigger.ActivityReward)
        {
            const actor = str(data, "actor");

            for (const member of snapshot.members)
            {
                if (text(member, "uid") !== actor)
                {
                    await publish(
                        text(member, "uid"),
                        AlliancePublicationPush.Points,
                        this.mapper.points(snapshot.record),
                    );
                }
            }

            return;
        }

        const record = snapshot.record,
            leader = snapshot.members.find((row) => row.rank === 5),
            effects = this.runtime.scienceEffects(snapshot.sciences);
        const scienceFields = (science: Row): Fields =>
            this.scienceMapper.publication(science, rules, snapshot.research);

        for (const member of snapshot.members)
        {
            const info = this.mapper.info(id, record, snapshot.members, member, leader, effects);
            await publish(
                text(member, "uid"),
                AlliancePublicationPush.Update,
                this.mapper.update(info),
            );

            if (
                command === AllianceApplicationCommand.AcceptApply
                && changed.some(
                    (entry) =>
                        str(entry.value, "uid") === member.uid
                        && str(entry.value, "allianceId") === id,
                )
            )
            {
                await publish(
                    text(member, "uid"),
                    AlliancePublicationPush.Join,
                    this.mapper.join(
                        info,
                        rules,
                        snapshot.sciences,
                        scienceFields,
                    ),
                );
            }

            if (command.startsWith("al.leader."))
            {
                await publish(
                    text(member, "uid"),
                    AlliancePublicationPush.Leader,
                    this.mapper.update(info),
                );
            }

            if (
                command === AllianceHelpCommand.Call || command === AllianceHelpCommand.Render
                || command === AllianceHelpCommand.All
            )
            {
                for (const help of snapshot.helps)
                {
                    const active = snapshot.queues.find(
                        (queue) => queue.uuid === help.content && queue.ownerId === help.senderId,
                    );

                    if (!active)
                    {
                        continue;
                    }

                    await publish(
                        text(member, "uid"),
                        command === AllianceHelpCommand.Call
                            ? AllianceHelpPush.New
                            : AllianceHelpPush.Update,
                        this.helpMapper.publication(help, active),
                    );
                }
            }

            if (command.startsWith("al.science.") || command === AlliancePublicationTrigger.Tick)
            {
                for (const science of snapshot.sciences)
                {
                    await publish(
                        text(member, "uid"),
                        AllianceSciencePush.Update,
                        this.mapper.science(scienceFields(science), record),
                    );
                }
            }
        }
    }
}
