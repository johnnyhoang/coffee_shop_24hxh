export const findBy = <T>(
  arr: T[],
  key: keyof T,
  value: T[keyof T],
): T | undefined => {
  return arr?.find((item) => item[key] === value);
};
