import busboy from "busboy";

export function multipart(body: Buffer, contentType: string): Promise<FormData> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    const parser = busboy({
      headers: { "content-type": contentType },
      limits: { files: 2, fields: 8, parts: 10, fieldSize: 4097 },
    });
    let invalid = false;
    parser.on("field", (name, value, info) => {
      invalid ||= info.valueTruncated;
      form.append(name, value);
    });
    parser.on("file", (name, stream, info) => {
      const chunks: Buffer[] = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () =>
        form.append(name, new File([Buffer.concat(chunks)], "image", { type: info.mimeType })),
      );
    });
    for (const event of ["filesLimit", "fieldsLimit", "partsLimit"] as const)
      parser.on(event, () => {
        invalid = true;
      });
    parser.on("error", reject);
    parser.on("close", () => (invalid ? reject(new Error("Multipart limit")) : resolve(form)));
    parser.end(body);
  });
}
