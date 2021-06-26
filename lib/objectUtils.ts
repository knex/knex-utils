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
  propNames: readonly K[]
): Pick<T, Exclude<keyof T, Exclude<keyof T, K>>> {
  const result = {} as T
  let idx = 0
  while (idx < propNames.length) {
    if (propNames[idx] in source) {
      // @ts-ignore
      result[propNames[idx]] = source[propNames[idx]]
    }
    idx += 1
  }
  return result
}

export function isEmptyObject(params: Record<string, any>): boolean {
  for (const key in params) {
    if (params.hasOwnProperty(key) && params[key] !== undefined) {
      return false
    }
  }
  return true
}
