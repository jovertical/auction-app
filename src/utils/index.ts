export const cx = (...args: unknown[]) => {
  return args
    .flat()
    .filter((x) => typeof x === 'string')
    .join(' ')
    .trim();
};

export const rescue = <T>(
  fn: () => T,
  fallback?: T
): Promise<T> | T | undefined => {
  try {
    return Promise.resolve(fn());
  } catch {
    return Promise.resolve(fallback as T);
  }
};
