export const cx = (...args: unknown[]) => {
  return args
    .flat()
    .filter((x) => typeof x === 'string')
    .join(' ')
    .trim();
};

export const rescueAsync = <T>(
  fn: () => T,
  fallback?: T
): Promise<T> | undefined => {
  try {
    return Promise.resolve(fn());
  } catch {
    return Promise.resolve(fallback as T);
  }
};

export const rescue = <T>(fn: () => T, fallback?: T): T | undefined => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};
