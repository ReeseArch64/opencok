import { copyFile, mkdir, readFile, rm } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { mediaFilename, validateTroopArtwork } from "../src/lib/artwork.mjs";

const app = fileURLToPath(new URL("../", import.meta.url));
const root = resolve(app, "../..");
const output = resolve(app, "node_modules/.cache/www-public/media");
const catalog = JSON.parse(await readFile(resolve(app, "src/data/catalog.json"), "utf8"));
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

let prepared = 0;
for (const item of catalog) {
  if (item.source === null) continue;
  const source = resolve(root, item.source);
  if (
    !source.startsWith(resolve(root, "data/cdn/extracteds") + sep) ||
    !/^[a-z0-9-]+$/.test(item.id)
  ) {
    throw new Error(`Invalid catalog asset: ${item.id}`);
  }
  if (item.category === "tropas") validateTroopArtwork(item, await readFile(source));
  await copyFile(source, resolve(output, mediaFilename(item)));
  prepared++;
}

for (const [source, target] of [
  ["assets/imgs/logo.png", "logo.png"],
  ["assets/imgs/icon.png", "icon.png"],
  ["assets/imgs/banners/1.jpg", "world.jpg"],
  ["assets/imgs/banners/2.jpg", "battle.jpg"],
  ["assets/imgs/banners/3.jpg", "king.jpg"],
  ["assets/imgs/banners/4.jpg", "dragon.jpg"],
]) {
  await copyFile(resolve(root, source), resolve(output, target));
}
await copyFile(resolve(app, "public/robots.txt"), resolve(dirname(output), "robots.txt"));
console.log(`Prepared ${prepared + 6} local assets for www.`);
