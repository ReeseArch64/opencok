export const chatDayMs = 86_400_000;

export function chatRetention(roomId: string, createdAt: number)
{
    const archived = roomId === "global_public" || roomId.startsWith("alliance_");
    const privateRoom = roomId.startsWith("private_") || roomId.startsWith("direct_");

    return {
        archiveAt: archived ? createdAt + chatDayMs : null,
        expiresAt: createdAt + (archived ? 7 : privateRoom ? 30 : 1) * chatDayMs,
    };
}
