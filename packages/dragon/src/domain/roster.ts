import type { Dragon } from "./dragon.ts";
import { BlackDragon } from "./black-dragon.ts";
import { RedDragon } from "./red-dragon.ts";
import { BlueDragon } from "./blue-dragon.ts";
import { Scartha } from "./scartha.ts";
import { Yukine } from "./yukine.ts";
import { Kraken } from "./kraken.ts";
import { Kylin } from "./kylin.ts";
import { ThunderBeast } from "./thunder-beast.ts";
import { FireEagle } from "./fire-eagle.ts";
import { SkeletalFrostDragon } from "./skeletal-frost-dragon.ts";
import { Hestal } from "./hestal.ts";
import { Hexa } from "./hexa.ts";
import { Carres } from "./carres.ts";
import { Vildrin } from "./vildrin.ts";

export const dragonRoster: readonly Dragon[] = [
    new BlackDragon(),
    new RedDragon(),
    new BlueDragon(),
    new Scartha(),
    new Yukine(),
    new Kraken(),
    new Kylin(),
    new ThunderBeast(),
    new FireEagle(),
    new SkeletalFrostDragon(),
    new Hestal(),
    new Hexa(),
    new Carres(),
    new Vildrin(),
];
