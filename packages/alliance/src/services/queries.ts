import type { Fields } from "@opencok/messages/sfs";
import type { AllianceQueryContext } from "../contracts/queries";
import type { AllianceQueryRuntime } from "../contracts/query-runtime";
import { AllianceQueryMapper } from "../mappings/queries";
import { AllianceQueryCommand } from "../enums/query-command";

export class AllianceQueryService
{
    public constructor(
        private readonly c: AllianceQueryContext,
        private readonly runtime: AllianceQueryRuntime,
        private readonly mapper: AllianceQueryMapper,
    )
    {}

    public command(command: string): Fields
    {
        const { text, num } = this.runtime;

        if (command === AllianceQueryCommand.Init)
        {
            const present = this.c.state.alliances.some((row) => row.uid === this.c.allianceId)
                && this.c.list().some((row) => row.uid === this.c.owner)
                && this.c.list().filter((row) => num(row, "rank") === 5).length === 1;

            return this.mapper.alliance(present ? this.c.snapshot() : {});
        }

        if (command === AllianceQueryCommand.Check)
        {
            return this.mapper.check(this.c.state.profiles, this.c.state.selection.playerId);
        }

        if (command === AllianceQueryCommand.Name || command === AllianceQueryCommand.Abbreviation)
        {
            const key = command === AllianceQueryCommand.Name ? "alliancename" : "abbr",
                value = this.c.state.selection.key ?? "";
            const invalid = value.length < 3
                || value.length > (command === AllianceQueryCommand.Name ? 20 : 3)
                || this.c.state.directory.some((row) =>
                    text(row, key).toLowerCase() === value.toLowerCase()
                );

            return this.mapper.result(invalid);
        }

        if (command === AllianceQueryCommand.Candidates)
        {
            this.c.right("invite");
            const eligible = this.c.state.candidates.filter(
                (row) =>
                    !this.c.state.applications.some(
                        (application) =>
                            application.userId === row.uid
                            && application.allianceId === this.c.allianceId
                            && (this.c.state.selection.key ? num(application, "type") === 1 : true),
                    ),
            );
            const preferred = eligible.filter((row) =>
                text(row, "lang").startsWith(this.c.state.selection.language ?? "")
            );
            const candidates = preferred.length ? preferred : eligible,
                page = this.c.state.selection.page ?? 1;

            return this.mapper.candidates(candidates, page, () => this.c.state.selection.page ?? 1);
        }

        if (command === AllianceQueryCommand.Search || command === AllianceQueryCommand.CheckName)
        {
            return command === AllianceQueryCommand.CheckName
                ? this.mapper.result(
                    !this.c.state.directory.some(
                        (row) =>
                            text(row, "alliancename").toLowerCase()
                                === (this.c.state.selection.key ?? "").toLowerCase(),
                    ),
                )
                : this.mapper.directory(
                    this.c.state.directory,
                    () => this.c.state.selection.page ?? 1,
                    () => this.c.state.directoryTotal,
                );
        }

        if (command === AllianceQueryCommand.FirstJoin)
        {
            return this.mapper.firstJoin(this.c.state.lords, this.c.owner);
        }

        if (command === AllianceQueryCommand.View)
        {
            return this.mapper.alliance(
                this.c.snapshot(
                    this.c.alliance(this.c.state.selection.allianceId ?? this.c.allianceId),
                ),
            );
        }

        if (command === AllianceQueryCommand.Rank)
        {
            const id = this.c.state.selection.allianceId ?? this.c.allianceId;
            this.c.alliance(id);

            return this.mapper.ranks(
                () => this.c.list(id),
                (uid) => this.c.profile(uid),
                (uid) => this.c.power(uid),
            );
        }

        return this.runtime.unsupportedFailure();
    }
}
