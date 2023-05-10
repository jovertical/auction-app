import sha256 from 'crypto-js/sha256';

/**
 * Creates a 256-bit hash of the value.
 */
export const createHash = (value: string) => {
  return sha256(value).toString();
};

/**
 * Whether the hashed value matches the raw value.
 */
export const compareHash = (original: string, value: string) => {
  return original === createHash(value);
};
