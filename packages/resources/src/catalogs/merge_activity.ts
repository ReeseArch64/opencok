import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";

export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    {
      "database": [
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "108900",
            "activityId": "57091",
            "merge_start": "0",
            "merge_end": "1440",
            "para1": "16803004",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "108901",
            "activityId": "57091",
            "merge_start": "1440",
            "merge_end": "2880",
            "para1": "16803001",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "108902",
            "activityId": "57091",
            "merge_start": "2880",
            "merge_end": "4320",
            "para1": "16803003",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "108903",
            "activityId": "57091",
            "merge_start": "4320",
            "merge_end": "5760",
            "para1": "16803004",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "108904",
            "activityId": "57091",
            "merge_start": "5760",
            "merge_end": "7200",
            "para1": "16803001",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "108905",
            "activityId": "57091",
            "merge_start": "7200",
            "merge_end": "8640",
            "para1": "16803003",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "108906", "activityId": "57145", "merge_start": "0", "merge_end": "10080" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "108908", "activityId": "57147", "merge_start": "0", "merge_end": "10080" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "108909", "activityId": "57148", "merge_start": "0", "merge_end": "7200" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "108910",
            "activityId": "57149",
            "merge_start": "2880",
            "merge_end": "7200",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "108911", "activityId": "57154", "merge_start": "0", "merge_end": "7200" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
