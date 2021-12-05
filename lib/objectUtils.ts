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

export function pickWithoutUndefined<T, K extends string | number | symbol>(
  source: T,
  propNames: readonly K[]
): Pick<T, Exclude<keyof T, Exclude<keyof T, K>>> {
  const result = {} as T
  let idx = 0
  while (idx < propNames.length) {
    // @ts-ignore
    if (propNames[idx] in source && source[propNames[idx]] !== undefined) {
      // @ts-ignore
      result[propNames[idx]] = source[propNames[idx]]
    }
    idx += 1
  }
  return result
}

export function validateOnlyWhitelistedFields<T>(source: T, propNames: readonly string[]) {
  const keys = Object.keys(source)
  for (var x = 0; x < keys.length; x++) {
    if (propNames.indexOf(keys[x]) === -1) {
      throw new Error(`Unsupported field: ${keys[x]}`)
    }
  }
}

export function validateOnlyWhitelistedFieldsSet(
  source: Record<string, any>,
  propNames: Set<string>
) {
  const keys = Object.keys(source)
  for (var x = 0; x < keys.length; x++) {
    if (!propNames.has(keys[x])) {
      throw new Error(`Unsupported field: ${keys[x]}`)
    }
  }
}

export function strictPickWithoutUndefined<T>(
  source: T,
  propNames: readonly string[]
): Pick<T, Exclude<keyof T, Exclude<keyof T, string>>> {
  validateOnlyWhitelistedFields(source, propNames)
  return pickWithoutUndefined(source, propNames)
}

export function isEmptyObject(params: Record<string, any>): boolean {
  for (const key in params) {
    if (params.hasOwnProperty(key) && params[key] !== undefined) {
      return false
    }
  }
  return true
}

export function groupBy<T>(inputArray: T[], propName: string): Record<string, T[]> {
  return inputArray.reduce((result, entry) => {
    // @ts-ignore
    const key = entry[propName]

    // @ts-ignore
    if (Object.hasOwnProperty.call(result, key)) {
      // @ts-ignore
      result[key].push(entry)
    } else {
      // @ts-ignore
      result[key] = [entry]
    }
    return result
  }, {})
}
