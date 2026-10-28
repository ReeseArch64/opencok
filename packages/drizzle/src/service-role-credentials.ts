import { createHash, createHmac, pbkdf2Sync, randomBytes } from "node:crypto";

export function serviceRoleIdentifier(value: string): string
{
    if (!/^[a-z][a-z0-9_]{0,62}$/.test(value))
    {
        throw new Error("Invalid database service role name");
    }

    return `"${value}"`;
}

export function serviceRolePasswordVerifier(password: string): string
{
    if (!/^[!-~]{24,256}$/.test(password))
    {
        throw new Error(
            "Database service password must contain 24 to 256 printable ASCII characters",
        );
    }
    const salt = randomBytes(16);
    const salted = pbkdf2Sync(password, salt, 4096, 32, "sha256");
    const client = createHmac("sha256", salted).update("Client Key").digest();
    const stored = createHash("sha256").update(client).digest("base64");
    const server = createHmac("sha256", salted).update("Server Key").digest("base64");

    return `SCRAM-SHA-256$4096:${salt.toString("base64")}$${stored}:${server}`;
}
