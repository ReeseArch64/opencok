import { createConnection, type Connection, type ConnectOptions } from "mongoose";

export async function connectMongoDB(
    uri: string,
    options: ConnectOptions = {},
): Promise<Connection>
{
    const connection = createConnection(uri, {
        maxPoolSize: 10,
        minPoolSize: 0,
        serverSelectionTimeoutMS: 5_000,
        connectTimeoutMS: 5_000,
        waitQueueTimeoutMS: 5_000,
        socketTimeoutMS: 10_000,
        ...options,
        bufferCommands: false,
        autoCreate: false,
        autoIndex: false,
    });

    try
    {
        return await connection.asPromise();
    }
    catch (error)
    {
        await connection.close().catch(() => {});
        throw error;
    }
}
