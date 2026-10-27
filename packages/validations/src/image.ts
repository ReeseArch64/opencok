import sharp from "sharp";
import { FILE_LIMIT } from "@opencok/contracts/files";
import { HttpError } from "@opencok/errors/http";

export async function encodeAvatar(file: File) {
  let encoded: Buffer;

  try {
    const image = sharp(Buffer.from(await file.arrayBuffer()), {
      limitInputPixels: 4194304,
      failOn: "warning",
    });
    const meta = await image.metadata();

    if (
      !["jpeg", "png"].includes(meta.format!) ||
      !meta.width ||
      !meta.height ||
      meta.width > 4096 ||
      meta.height > 4096 ||
      (meta.pages ?? 1) > 1 ||
      ![`image/${meta.format}`, "application/octet-stream"].includes(file.type)
    )
      {throw new Error("Invalid image");}

    encoded = await image.flatten({ background: "#000000" }).jpeg({ quality: 90 }).toBuffer();
  } catch {
    throw new HttpError(415, "Invalid JPEG or PNG image");
  }

  if (encoded.length > FILE_LIMIT) {throw new HttpError(413, "Encoded image too large");}

  return encoded;
}
