export interface NicknameCheck
{
    occupied: number;
    exist: number;
    length: number;
    remainLength: number;
}

export interface NicknameCheckProviders
{
    containsBadWords(name: string): boolean | Promise<boolean>;
    occupied(name: string): Promise<boolean>;
}
