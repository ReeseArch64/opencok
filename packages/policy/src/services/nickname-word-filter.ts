import {
    containsNicknameBadWords,
    filterNicknameBadWords,
    nicknameBadWordEntries,
} from "../rules/nickname-words";

export type NicknameForbiddenReader = (key: string) => Promise<readonly string[]>;

export class NicknameWordFilter
{
    private entries: string[] = [];
    private reserved: readonly string[] = [];
    private loading = false;

    constructor(
        private readonly read: () => Promise<readonly string[]>,
        private readonly readForbidden?: NicknameForbiddenReader,
    )
    {}

    reservedNamePatterns(): readonly string[]
    {
        return [...this.reserved];
    }

    contains(name: string): boolean
    {
        return containsNicknameBadWords(name, this.entries, this.loading);
    }

    filter(text: string): string
    {
        return filterNicknameBadWords(text, this.entries, this.loading);
    }

    async reload(): Promise<void>
    {
        this.loading = true;

        try
        {
            this.entries = nicknameBadWordEntries(await this.read(), this.entries);

            if (this.readForbidden)
            {
                for (const kind of ["regular", "strict", "pattern", "weight", "name"])
                {
                    const entries = await this.readForbidden(`forbidden_words_${kind}`);

                    if (kind === "name")
                    {
                        this.reserved = [...entries];
                    }
                }
            }
        }
        catch
        {
        }
        finally
        {
            this.loading = false;
        }
    }
}
