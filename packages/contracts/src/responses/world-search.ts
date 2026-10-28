export interface WorldSearchResponse
{
    readonly list: {
        readonly uid: string;
        readonly name: string;
        readonly pic?: string;
        readonly abbr: string;
        readonly pointId: number;
        readonly picVer?: number;
        readonly power?: bigint;
    }[];
}
