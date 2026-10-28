import { createHash } from "node:crypto";
import { logEvent } from "@opencok/core/logging";
import {
    BODY_LIMIT,
    FILE_LIMIT,
    IMAGE_PATH,
    UPLOAD_PATH,
    type ImageStore,
    type AvatarTickets,
} from "@opencok/contracts/files";
import { HttpError } from "@opencok/errors/http";
import { avatarImagePath } from "@opencok/identity/avatar";
import { encodeAvatar } from "@opencok/validations/image";
import { multipart } from "./files-multipart";

function json(data: object, status = 200)
{
    return Response.json(
        { response: [{ commandName: "user/UploadPhoto", ...data }] },
        {
            status,
            headers: { "Cache-Control": "no-store" },
        },
    );
}

async function boundedBody(request: Request)
{
    if (Number(request.headers.get("content-length")) > BODY_LIMIT)
    {
        throw new HttpError(413, "Upload too large");
    }

    const reader = request.body?.getReader();

    if (!reader)
    {
        throw new HttpError(400, "Invalid request");
    }

    const chunks: Uint8Array[] = [];
    let size = 0;

    try
    {
        while (true)
        {
            const { done, value } = await reader.read();

            if (done)
            {
                break;
            }

            size += value.length;

            if (size > BODY_LIMIT)
            {
                await reader.cancel();

                throw new HttpError(413, "Upload too large");
            }

            chunks.push(value);
        }
    }
    finally
    {
        reader.releaseLock();
    }

    return Buffer.concat(chunks);
}

export function createHandler(store: ImageStore, tickets: AvatarTickets)
{
    return async (request: Request): Promise<Response> => {
        const url = new URL(request.url);

        try
        {
            if (url.pathname === "/_health" && request.method === "GET")
            {
                return new Response("ok\n");
            }

            const confirmation = /^\/_internal\/avatars\/([0-9]{1,20})\/([1-9][0-9]{0,5})(\/url)?$/
                .exec(
                    url.pathname,
                );

            if (confirmation && !url.search && request.method === "GET")
            {
                const owner = confirmation[1]!,
                    sequence = confirmation[2]!;
                const purpose = confirmation[3] ? "image" : "confirm";
                const authorization = await tickets.verify(
                    request.headers.get("x-avatar-confirmation") ?? "",
                    purpose,
                );

                if (authorization.owner !== owner || authorization.seq !== sequence)
                {
                    throw new HttpError(401, "Invalid avatar authorization");
                }

                if (purpose === "image")
                {
                    const path = avatarImagePath(owner, Number(sequence)).slice("/cok/img/".length);

                    return new Response(await store.image(path), {
                        headers: {
                            "Content-Type": "text/plain; charset=utf-8",
                            "Cache-Control": "no-store",
                        },
                    });
                }

                const receipt = await store.find(owner, sequence);

                if (!receipt)
                {
                    return new Response(null, { status: 404 });
                }

                return new Response(
                    `v1\n${receipt.owner}\n${receipt.sequence}\n${receipt.hash}\n`,
                    {
                        headers: {
                            "Content-Type": "text/plain; charset=us-ascii",
                            "Cache-Control": "no-store",
                        },
                    },
                );
            }

            const match = IMAGE_PATH.exec(url.pathname);

            if (match && ["GET", "HEAD"].includes(request.method))
            {
                throw new HttpError(401, "Use an authorized S3 image URL");
            }

            if (url.pathname !== UPLOAD_PATH)
            {
                throw new HttpError(404, "Unknown endpoint");
            }

            if (request.method !== "POST")
            {
                return new Response(null, { status: 405, headers: { Allow: "POST" } });
            }

            const grant = await tickets.verify(
                url.searchParams.size === 1 ? (url.searchParams.get("grant") ?? "") : "",
                "upload",
            );
            const body = await boundedBody(request);
            let form: FormData;

            try
            {
                form = await multipart(body, request.headers.get("content-type") ?? "");
            }
            catch
            {
                throw new HttpError(400, "Invalid multipart request");
            }

            const data = form.get("data");

            if (
                typeof data !== "string"
                || Buffer.byteLength(data) > 4096
                || form.getAll("data").length !== 1
            )
            {
                throw new HttpError(400, "Invalid request");
            }

            let parsed;

            try
            {
                parsed = JSON.parse(data);
            }
            catch
            {
                throw new HttpError(400, "Invalid request");
            }

            if (
                !Array.isArray(parsed?.data)
                || parsed.data.length !== 1
                || parsed.data[0]?.commandName !== "user/UploadPhoto"
            )
            {
                throw new HttpError(404, "Unknown command");
            }

            const params = parsed.data[0].params;

            if (
                !Array.isArray(params)
                || params.length !== 1
                || params[0]?.gameuid == null
                || params[0]?.photo_seq == null
            )
            {
                throw new HttpError(400, "Invalid parameters");
            }

            if (
                !["string", "number"].includes(typeof params[0].gameuid)
                || !["string", "number"].includes(typeof params[0].photo_seq)
                || String(params[0].gameuid) !== grant.owner
                || String(params[0].photo_seq) !== grant.seq
            )
            {
                throw new HttpError(403, "Grant does not authorize this image");
            }

            const file = form.get("file");
            const files = [...form.values()].filter((value) => typeof value !== "string");

            if (!(file instanceof File) || files.length !== 1)
            {
                throw new HttpError(400, "One image required");
            }

            if (file.size < 1 || file.size > FILE_LIMIT)
            {
                throw new HttpError(413, "Image too large");
            }

            const encoded = await encodeAvatar(file);
            logEvent("artifact_prepared", {
                artifactType: "avatar",
                bytes: encoded.length,
                outcome: "success",
            });
            const name = createHash("md5").update(`${grant.owner}_${grant.seq}`).digest("hex")
                + ".jpg";
            const key = `${grant.owner.slice(-6)}/${name}`;
            const hash = createHash("sha256").update(encoded).digest("hex");
            let reused = false;

            try
            {
                await store.put(key, encoded, grant.owner, grant.seq, hash);
            }
            catch (error)
            {
                if (!(error instanceof HttpError) || error.status !== 409)
                {
                    throw error;
                }

                const receipt = await store.find(grant.owner, grant.seq);

                if (!receipt || receipt.hash !== hash)
                {
                    throw error;
                }
                reused = true;
            }

            logEvent(reused ? "artifact_reused" : "artifact_stored", {
                artifactType: "avatar",
                bytes: encoded.length,
                outcome: "success",
            });
            await store.removePrevious(grant.owner, grant.seq);

            return json({
                status: 1,
                data: {
                    file_name: name,
                    path: await store.image(key),
                    image_hash: hash,
                    sequence: Number(grant.seq),
                },
            });
        }
        catch (error)
        {
            const status = error instanceof HttpError ? error.status : 503;

            return json(
                {
                    status: 0,
                    errorCode: status,
                    errorMsg: status === 503 ? "Upload unavailable" : (error as Error).message,
                },
                status,
            );
        }
    };
}
