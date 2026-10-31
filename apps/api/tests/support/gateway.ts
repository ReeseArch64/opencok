export async function gatewayYaml(mediaEnabled = true): Promise<string>
{
    const source = await Bun.file(
        new URL("../../../../docker/gateway/dynamic.yml.tmpl", import.meta.url),
    ).text();

    return source.replace(
        /\{\{ if env "S3_ENDPOINT" }}([\s\S]*?)\{\{ end }}/g,
        (_, block: string) => mediaEnabled ? block : "",
    );
}
