export interface ShareFeedEnvelopeInput
{
    fid?: string;
    id?: string;
    type?: number;
    data?: string;
    auth?: string;
    notices?: string;
    localid?: string;
}

export interface ShareFeedEnvelope
{
    feedId: string;
    feedType: number;
    feedData: string;
    feedAuth: string;
    notices: string[];
    localId: string;
}

export type ShareFeedNormalizer = (value: ShareFeedEnvelopeInput) => ShareFeedEnvelope;
