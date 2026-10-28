import { dragonDefinitions } from "@opencok/resources/dragons/roster";

process.stdout.write(
    JSON.stringify(
        {
            release: "v12.06.0",
            catalogs: [{ catalog: "dragon_base", ids: dragonDefinitions.map((entry) => entry.id) }],
        },
        null,
        2,
    ) + "\n",
);
