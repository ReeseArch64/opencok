export interface AllianceHeartPersistenceRuntime
{
    cityInteger(value: unknown, minimum?: number, maximum?: number): number;
    recipient(uid: string): string;
}
