export async function tryCatch<T>(promise: Promise<T>): Promise<[Error | null, T | null]> {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [error as Error, null];
  }
}

export function syncTryCatch<T>(call: () => T): [Error | null, T | null] {
  try {
    const data = call();
    return [null, data];
  } catch (error) {
    return [error as Error, null];
  }
}
