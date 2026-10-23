import artifact from "../../postgresql/manifest.json";
import type { MigrationManifest } from "./model";

export const manifest = artifact as unknown as MigrationManifest;
