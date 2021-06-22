export function copyWithoutUndefined<T extends Record<K, V>, K extends string | number | symbol, V>(
  originalValue: T
): T {
  return Object.keys(originalValue).reduce((acc, key) => {
    // @ts-ignore
    if (originalValue[key] !== undefined) {
      // @ts-ignore
      acc[key] = originalValue[key]
    }
    return acc
  }, {} as Record<string, any>) as T
}

export function pick<T, K extends string | number | symbol>(
  source: T,
  names: readonly K[]
): Pick<T, Exclude<keyof T, Exclude<keyof T, K>>> {
  const result = {} as T
  let idx = 0
  while (idx < names.length) {
    if (names[idx] in source) {
      // @ts-ignore
      result[names[idx]] = source[names[idx]]
    }
    idx += 1
  }
  return result
}
