import { expect, test } from "bun:test";
import { mediaFilename, validateTroopArtwork } from "../src/lib/artwork.mjs";

const troop = { id: "tropa-example", category: "tropas", source: "ico-example.png" };
const filteredPngs = [
  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGklEQVR4nGPQsAlgqOhZ8J+BS87of0pFTwMANIEGmQqUm48AAAAASUVORK5CYII=",
  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGklEQVR4nGPUsAlgCAgI+M/IJWf0PyoqqhEAK28FjkLjgrAAAAAASUVORK5CYII=",
  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAG0lEQVR4nGPSsAlgqOhZ8J/p0aNH/9+8edMIAEkwCkbjoZxAAAAAAElFTkSuQmCC",
  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGklEQVR4nGPWsAlgSMmr+M/8jYHrv7KyciMAM3gF7V17iEIAAAAASUVORK5CYII=",
  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAG0lEQVR4nGPRsAlgCAgI+M/y6NGj/2/evGkEAEEeCZYHTHCSAAAAAElFTkSuQmCC",
];

test("mediaFilename_troop_usesSeparateFullBodyUrl", () => {
  expect(mediaFilename(troop)).toBe("tropa-example-full.png");
});

test("mediaFilename_otherCategory_preservesExistingUrl", () => {
  expect(mediaFilename({ id: "skin-example", category: "skins" })).toBe("skin-example.png");
});

test.each(filteredPngs)("validateTroopArtwork_transparentPng_acceptsSupportedPngFilters", (png) => {
  expect(() => validateTroopArtwork(troop, Buffer.from(png, "base64"))).not.toThrow();
});

test.each(["ico-example_small.png", "ico-example_head.png"])(
  "validateTroopArtwork_thumbnail_rejectsFullBodySubstitution",
  (source) => {
    expect(() => validateTroopArtwork({ ...troop, source }, Buffer.alloc(0))).toThrow("thumbnail");
  },
);

test("validateTroopArtwork_opaqueScreenshot_rejectsBackground", () => {
  const opaque = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGklEQVR4nGPQsAn4X9Gz4D8Dl5zR/5SKnv8AQvIIF0y9l0IAAAAASUVORK5CYII=",
    "base64",
  );
  expect(() => validateTroopArtwork(troop, opaque)).toThrow("opaque background");
});

test("validateTroopArtwork_emptyCutout_rejectsInvisibleArt", () => {
  const empty = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGklEQVR4nGPQsAlgqOhZwMDAJWfEkFLRwwAAJRAEG/YKNjYAAAAASUVORK5CYII=",
    "base64",
  );
  expect(() => validateTroopArtwork(troop, empty)).toThrow("empty");
});

test("validateTroopArtwork_otherCategory_doesNotRestrictExistingArt", () => {
  expect(() =>
    validateTroopArtwork({ ...troop, category: "skins" }, Buffer.alloc(0)),
  ).not.toThrow();
});

test("validateTroopArtwork_pendingArt_doesNotRequireFile", () => {
  expect(() => validateTroopArtwork({ ...troop, source: null }, Buffer.alloc(0))).not.toThrow();
});

test("validateTroopArtwork_nonPng_rejectsInvalidFormat", () => {
  expect(() => validateTroopArtwork(troop, Buffer.from("not an image"))).toThrow("expected PNG");
});

test.each([24, 25, 28])("validateTroopArtwork_unsupportedEncoding_rejectsHeader", (offset) => {
  const png = Buffer.from(filteredPngs[0], "base64");
  png[offset] = 1;
  expect(() => validateTroopArtwork(troop, png)).toThrow("RGBA PNG");
});

test("validateTroopArtwork_truncatedChunk_rejectsDamagedFile", () => {
  const png = Buffer.from(filteredPngs[0], "base64").subarray(0, 40);
  expect(() => validateTroopArtwork(troop, png)).toThrow("truncated");
});

test("validateTroopArtwork_zeroWidth_rejectsDimensions", () => {
  const png = Buffer.from(filteredPngs[0], "base64");
  png.writeUInt32BE(0, 16);
  expect(() => validateTroopArtwork(troop, png)).toThrow("dimensions");
});

test("validateTroopArtwork_inconsistentHeight_rejectsPixelData", () => {
  const png = Buffer.from(filteredPngs[0], "base64");
  png.writeUInt32BE(3, 20);
  expect(() => validateTroopArtwork(troop, png)).toThrow("pixel data");
});
