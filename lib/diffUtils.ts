import { Knex } from 'knex'
import { pick } from './objectUtils'
import { chunk } from './chunkUtils'

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

export type UpdateJoinTableParams = {
  filterCriteria: Record<string, any>
  table: string
  primaryKeyField?: string
  chunkSize?: number
  idFields: string[]
}

async function getKnexOrTrx(knex: Knex): Promise<Knex | Knex.Transaction> {
  if (knex.client.driverName === 'sqlite3') {
    return knex
  }

  return knex.transaction()
}

export async function updateJoinTable<T>(
  knex: Knex,
  newList: T[],
  params: UpdateJoinTableParams
): Promise<JoinTableDiff<T>> {
  const chunkSize = params.chunkSize || 100
  const trx = await getKnexOrTrx(knex)
  try {
    const oldList = await knex(params.table).select('*').where(params.filterCriteria)
    const diff = calculateJoinTableDiff(oldList, newList, params.idFields)

    const insertChunks = chunk(diff.newEntries, chunkSize)
    for (const insertChunk of insertChunks) {
      await knex(params.table).insert(insertChunk)
    }

    // If we have a primary key, then we can delete in batch
    if (params.primaryKeyField) {
      const deleteIds = diff.removedEntries.map((entry) => {
        return entry[params.primaryKeyField!]
      })
      const deleteChunks = chunk(deleteIds, chunkSize)
      for (const deleteChunk of deleteChunks) {
        await knex(params.table).delete().whereIn(params.primaryKeyField, deleteChunk)
      }
    }
    // Otherwise we have to delete one-by-one
    else {
      const deleteCriteria = diff.removedEntries.map((entry) => {
        return pick(entry, params.idFields)
      })
      for (const entry of deleteCriteria) {
        await knex(params.table).delete().where(entry)
      }
    }

    if (trx.isTransaction) {
      await (trx as Knex.Transaction).commit()
    }
    return diff
  } catch (err) {
    if (trx.isTransaction) {
      await (trx as Knex.Transaction).rollback()
    }
    throw err
  }
}
