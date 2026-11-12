export function mongoUuidExpression(field: string, nullable = false)
{
    const valid = {
        $ne: [
            {
                $convert: {
                    input: `$${field}`,
                    to: "string",
                    format: "uuid",
                    onError: null,
                    onNull: null,
                },
            },
            null,
        ],
    };
    return nullable ? { $or: [{ $eq: [`$${field}`, null] }, valid] } : valid;
}
