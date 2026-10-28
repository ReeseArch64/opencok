export interface AnniversaryTaskResponse
{
    task_id: number;
    task_score: number;
    task_score_max: number;
}

export interface AnniversaryGroupResponse
{
    master_task_id: number;
    task_array: AnniversaryTaskResponse[];
}

export interface AnniversaryWeekResponse
{
    week_id: number;
    box_score: number;
    box_already_taken: number[];
    task_data: AnniversaryGroupResponse[];
}

export interface AnniversaryResponse
{
    anniversary_array: AnniversaryWeekResponse[];
    cake_already_taken: number;
    curr_week_id: number;
}

export interface AnniversaryStatisticsResponse
{
    atkTime?: bigint;
    atkName?: string;
    defTime?: bigint;
    teamAtkTime?: bigint;
    regTime: string;
    regTop: bigint;
    power: bigint;
    powerPercent: number;
    food: bigint;
    feedPeople: bigint;
    wood: bigint;
    cutTree: bigint;
    train: bigint;
    armyType: number;
    maxTrain: bigint;
    maxTrainPercent: number;
    dead: bigint;
    deadPercent: number;
    worldWarPercent: number;
    kill: bigint;
    killPercent: string;
    allianceAllNum: number;
    allianceNum: number;
}

export interface CampaignTriggerResponse
{
    type: number;
}
