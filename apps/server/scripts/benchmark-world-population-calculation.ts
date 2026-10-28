import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { cpus } from "node:os";
import { resolve } from "node:path";
import { chooseWorldMonsterCells } from "@opencok/rules/world-monsters";
import { distribution } from "./benchmark-distribution";

const output = process.argv[2];
const iterations = Number(process.argv[3] ?? 1000);
if (!output || !Number.isInteger(iterations) || iterations < 100 || iterations > 10000)
{
    throw new Error(
        "Usage: benchmark-world-population-calculation.ts /tmp/report.json [100..10000 iterations] [snapshot revision]",
    );
}
const size = 64;
const points = Array.from({ length: size ** 2 }, (_, index) => ({ id: index + 1 }));
const scenarios = [
    { name: "single-cell", points, four: false, rejectFirst: false, expected: [4096], draws: 1 },
    {
        name: "four-valid",
        points,
        four: true,
        rejectFirst: false,
        expected: [4096, 4095, 4032, 4031],
        draws: 1,
    },
    {
        name: "four-after-rejection",
        points,
        four: true,
        rejectFirst: true,
        expected: [4096, 4095, 4032, 4031],
        draws: 2,
    },
    {
        name: "four-exhausted",
        points: points.filter((row) =>
            ((row.id - 1) % size + Math.floor((row.id - 1) / size)) % 2 === 0
        ),
        four: true,
        rejectFirst: false,
        expected: [],
        draws: 2048,
    },
];
const results = [];
for (const scenario of scenarios)
{
    const original = scenario.points.map((row) => row.id);
    const execute = () => {
        let draws = 0;
        const result = chooseWorldMonsterCells(scenario.points, scenario.four, size, (maximum) => {
            draws++;
            return scenario.rejectFirst && draws === 1 ? 0 : maximum - 1;
        });
        return { ids: result.map((row) => Number(row.id)), draws };
    };
    const expected = { ids: scenario.expected, draws: scenario.draws };
    for (let index = 0; index < 20; index++)
    {
        assert.deepEqual(execute(), expected);
    }
    const samples = [];
    const memoryBefore = process.memoryUsage();
    const cpuBefore = process.cpuUsage();
    const started = performance.now();
    for (let index = 0; index < iterations; index++)
    {
        const start = performance.now();
        const actual = execute();
        samples.push(performance.now() - start);
        assert.deepEqual(actual, expected);
    }
    const wallMs = performance.now() - started;
    const cpu = process.cpuUsage(cpuBefore);
    const memoryAfter = process.memoryUsage();
    assert.deepEqual(scenario.points.map((row) => row.id), original);
    results.push({
        name: scenario.name,
        candidates: scenario.points.length,
        iterations,
        warmupIterations: 20,
        wallMs,
        functionMs: distribution(samples),
        cpuMs: { user: cpu.user / 1000, system: cpu.system / 1000 },
        memoryBytes: { before: memoryBefore, after: memoryAfter },
        expected,
        inputPreserved: true,
    });
}
const root = new URL("../../../", import.meta.url).pathname;
const revision = Bun.spawnSync(["git", "rev-parse", "HEAD"], { cwd: root });
const sourceRevision = process.argv[4]
    ?? (revision.exitCode === 0 ? revision.stdout.toString().trim() : null);
if (!sourceRevision)
{
    throw new Error("A snapshot without Git metadata requires an explicit source revision");
}
const hashes = [];
for (
    const path of [
        "apps/server/scripts/benchmark-world-population-calculation.ts",
        "apps/server/scripts/benchmark-distribution.ts",
        "packages/rules/src/world-monsters.ts",
        "packages/rules/src/world-march-runtime.ts",
        "packages/rules/src/city-progression.ts",
        "packages/contracts/src/rows.ts",
    ]
)
{
    hashes.push({
        path,
        sha256: createHash("sha256").update(
            new Uint8Array(await Bun.file(resolve(root, path)).arrayBuffer()),
        ).digest("hex"),
    });
}
await Bun.write(
    resolve(output),
    `${
        JSON.stringify(
            {
                schemaVersion: 1,
                measuredAt: new Date().toISOString(),
                sourceRevision,
                sourceSha256: createHash("sha256").update(JSON.stringify(hashes)).digest("hex"),
                sources: hashes,
                environment: {
                    bun: Bun.version,
                    platform: process.platform,
                    architecture: process.arch,
                    cpuModel: cpus()[0]?.model,
                },
                size,
                scenarios: results,
                limitations: [
                    "Microbenchmark of the complete existing chooseWorldMonsterCells function, including candidate copy, lookup allocation, selection, rejection and removal. No worker, IPC, database, full catalog or generation transaction.",
                    "Function timing also includes the draw-count wrapper and projection of result IDs; CPU and wall time include assertion overhead and process GC. RSS before/after is not a sampled peak.",
                    "Fixed input order and RNG choices deliberately exercise bounded best and adverse cases. Costs do not represent production frequency or full population recovery.",
                    "Single-thread synchronous loop after twenty warmups; no event-loop latency or worker-isolation benefit is inferred.",
                ],
            },
            null,
            2,
        )
    }\n`,
);
console.log(`World population calculation benchmark saved to ${resolve(output)}`);
