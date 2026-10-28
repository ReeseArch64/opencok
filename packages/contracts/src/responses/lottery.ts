export interface LotteryInfoResponse
{
    type: number;
    supermode: number;
    times1: number;
    times2: number;
    boxTimes: number;
    normal: string;
    super: string;
    updatetime: bigint;
    rewards?: string;
    lotteryInfo?: string;
}
