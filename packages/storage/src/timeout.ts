import { DependencyError } from "@opencok/errors/dependency";

export async function bounded<T>(task: Promise<T>, timeout: number, component: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      task,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new DependencyError(component)), timeout);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}
