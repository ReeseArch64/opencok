import { Worker } from "node:worker_threads";
import { reservedNicknameText, reservedNicknamePattern } from "@opencok/rules/nickname-reserved";

export async function containsReservedNickname(
  name: string,
  patterns: readonly string[],
): Promise<boolean> {
  if (typeof name !== "string" || name.length > 65535 || patterns.length > 10000)
    {throw new Error("Invalid reserved nickname input");}

  if (!patterns.length) {return false;}

  const text = reservedNicknameText(name);
  const expressions: ({ pattern: string; flags: string } | { invalid: true })[] = [];
  let bytes = 0;

  for (const pattern of patterns) {
    let expression: (typeof expressions)[number];

    try {
      expression = reservedNicknamePattern(pattern);
    } catch {
      expression = { invalid: true };
    }

    bytes += JSON.stringify(expression).length;

    if (bytes > 4 * 1024 * 1024) {throw new Error("Reserved nickname patterns exceed bound");}

    expressions.push(expression);
  }

  return new Promise<boolean>((resolve, reject) => {
    const worker = new Worker(
      `const {parentPort,workerData}=require('node:worker_threads');try{parentPort.postMessage(workerData.expressions.some(entry=>{if(entry.invalid)throw new Error();return new RegExp(entry.pattern,entry.flags).test(workerData.text);}));}catch{parentPort.postMessage(null);}`,
      {
        eval: true,
        workerData: { text, expressions },
        resourceLimits: { maxOldGenerationSizeMb: 32 },
      },
    );
    const timer = setTimeout(() => {
      void worker.terminate();
      reject(new Error("Reserved nickname matching deadline"));
    }, 1000);
    worker.once("message", (value) => {
      clearTimeout(timer);
      void worker.terminate();

      if (typeof value === "boolean") {resolve(value);}
      else {reject(new Error("Reserved nickname matching failed"));}
    });
    worker.once("error", () => {
      clearTimeout(timer);
      void worker.terminate();
      reject(new Error("Reserved nickname worker failed"));
    });
    worker.once("exit", (code) => {
      if (code !== 0) {
        clearTimeout(timer);
        reject(new Error("Reserved nickname worker stopped"));
      }
    });
  });
}
