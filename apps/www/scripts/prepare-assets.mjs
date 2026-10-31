import { copyFile, mkdir, readFile, rm } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const app = fileURLToPath(new URL("../", import.meta.url));
const root = resolve(app, "../..");
const output = resolve(app, "node_modules/.cache/www-public/media");
const catalog = JSON.parse(await readFile(resolve(app, "src/data/catalog.json"), "utf8"));
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const item of catalog) {
  const source = resolve(root, item.source);
  if (
    !source.startsWith(resolve(root, "data/cdn/extracteds") + sep) ||
    !/^[a-z0-9-]+$/.test(item.id)
  ) {
    throw new Error(`Invalid catalog asset: ${item.id}`);
  }
  await copyFile(source, resolve(output, `${item.id}.png`));
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
console.log(`Prepared ${catalog.length + 6} local assets for www.`);
