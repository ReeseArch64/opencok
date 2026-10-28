export interface OlympicQuestionResponse
{
    id: string;
    startBetTime: bigint;
    startTime: bigint;
    betCount: bigint;
    resourceType: number;
    resourceNum: bigint;
}

export interface OlympicBetResponse
{
    uid: string;
    questionId: string;
    resourceType: number;
    betNum: number;
    betCountry: string;
    result: string;
    ended: number;
    rewarded: number;
    reward: number;
    endTime?: bigint;
    betCount?: bigint;
}
