function arrayIncludesWith(array: any[], target: any, comparator: any) {
  if (array == null) {
    return false
  }

  for (const value of array) {
    if (comparator(target, value)) {
      return true
    }
  }
  return false
}

function baseDifference<T>(initialArray: T[], newArray: T[], comparator: any): JoinTableDiff<T> {
  const includes = arrayIncludesWith
  const newEntries: T[] = []
  const removedEntries: T[] = []

  if (!initialArray.length) {
    return {
      newEntries: [],
      removedEntries: [],
    }
  }

  for (const value of initialArray) {
    if (!includes(newArray, value, comparator)) {
      removedEntries.push(value)
    }
  }

  for (const value of newArray) {
    if (!includes(initialArray, value, comparator)) {
      newEntries.push(value)
    }
  }

  return {
    removedEntries,
    newEntries,
  }
}

export type JoinTableDiff<T> = {
  newEntries: T[]
  removedEntries: T[]
}

export function calculateJoinTableDiff<T>(
  oldList: T[],
  newList: T[],
  idFields: string[]
): JoinTableDiff<T> {
  const comparator = (value1: any, value2: any) => {
    for (const idField of idFields) {
      if (value1[idField] !== value2[idField]) {
        return false
      }
    }
    return true
  }

  return baseDifference(oldList, newList, comparator)
}

export function calculateEntityDiff<T>(
  oldList: T[],
  newList: T[],
  idField: string
): JoinTableDiff<T> {
  return calculateJoinTableDiff(oldList, newList, [idField])
}
