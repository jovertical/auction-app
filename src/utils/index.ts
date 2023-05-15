export const cx = (...args: unknown[]) => {
  return args
    .flat()
    .filter((x) => typeof x === 'string')
    .join(' ')
    .trim();
};

export const generateAvatarColor = (letter: string) => {
  if (!letter) return 'gray';

  const charCode = letter.charCodeAt(0);

  if (charCode >= 65 && charCode <= 73) return 'red';
  if (charCode >= 74 && charCode <= 82) return 'teal';
  if (charCode >= 83 && charCode <= 90) return 'pink';

  return 'gray';
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

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
