import { createHash } from "node:crypto";

const originalPolicy = `var UI_CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self' http://127.0.0.1:* http://localhost:*",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'"
].join("; ");`;

export function patchMapleCsp(binary: Uint8Array): Buffer
{
    const input = Buffer.from(binary);
    const expected = Buffer.from(originalPolicy);
    const offset = input.indexOf(expected);

    if (offset < 0 || input.indexOf(expected, offset + 1) >= 0)
    {
        throw new Error("Expected exactly one Maple v0.3.0 UI policy");
    }

    const replacement = Buffer.from(
        originalPolicy
            .replace("script-src 'self'", "script-src 'self' 'wasm-unsafe-eval'")
            .replaceAll("\n  ", "\n")
            .replace("\n].join", "\n ].join"),
    );

    if (replacement.length !== expected.length)
    {
        throw new Error("Maple CSP patch must preserve executable offsets");
    }

    const output = Buffer.from(input);
    replacement.copy(output, offset);

    if (
        !output.subarray(0, offset).equals(input.subarray(0, offset))
        || !output.subarray(offset + expected.length).equals(
            input.subarray(offset + expected.length),
        )
    )
    {
        throw new Error("Maple CSP patch changed bytes outside its policy");
    }

    return output;
}

if (import.meta.main)
{
    const [inputPath, outputPath, architecture] = Bun.argv.slice(2);

    if (!inputPath || !outputPath || architecture !== "amd64")
    {
        throw new Error("Maple CSP patch currently supports the verified amd64 release only");
    }

    const input = new Uint8Array(await Bun.file(inputPath).arrayBuffer());
    const digest = createHash("sha256").update(input).digest("hex");

    if (digest !== "23b64d31afe181b2b2d04913fb322ca4ec31ca926951d3a34cd55cf6fe020974")
    {
        throw new Error("Unexpected Maple v0.3.0 amd64 executable checksum");
    }

    await Bun.write(outputPath, patchMapleCsp(input));
}
