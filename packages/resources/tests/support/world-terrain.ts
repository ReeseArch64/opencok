export function terrainXml(size = 5, base?: readonly number[], overlay?: readonly number[])
{
    const data = (values: readonly number[] | undefined, fallback: number) =>
        Array.from(
            { length: size * size },
            (_, index) => `<tile gid="${values?.[index] ?? fallback}"/>`,
        ).join("");
    return `<map orientation="isometric" width="${size}" height="${size}"><tileset firstgid="1"><terraintypes><terrain><properties><property name="type" value="neutrally"/></properties></terrain><terrain><properties><property name="type" value="STOP"/></properties></terrain><terrain><properties><property name="type" value="space"/></properties></terrain></terraintypes><tile id="0" terrain="0,0,0,0"/><tile id="1" terrain="1,1,1,1"/><tile id="2" terrain="2,2,2,2"/></tileset><tileset firstgid="99"><terraintypes><terrain><properties><property name="type" value="none"/></properties></terrain><terrain><properties><property name="type" value="stop"/></properties></terrain></terraintypes><tile id="0" terrain="0,0,0,0"/><tile id="1" terrain="1,1,1,1"/></tileset><layer width="${size}" height="${size}"><data>${
        data(base, 3)
    }</data></layer><layer width="${size}" height="${size}"><data>${
        data(overlay, 0)
    }</data></layer></map>`;
}
