import Knex from 'knex'

const HEARTBEAT_QUERIES = Object.freeze({
  ORACLE: 'select 1 from DUAL',
  POSTGRESQL: 'SELECT 1',
  MYSQL: 'SELECT 1',
  MSSQL: 'SELECT 1',
  SQLITE: 'SELECT 1',
  DEFAULT: 'SELECT 1',
})

export interface HeartbeatResult {
  isOk: boolean
  error?: Error
}

/**
 *
 * @param {Object} knex - Knex instance
 * @param {string} heartbeatQuery - SQL query that will be executed to check if connection is valid
 * @returns Promise<{Object|undefined}> wrapped error if connection is not valid, wrapped 'isOk: true' if it is valid, undefined if connection does not yet exist
 */
export function checkHeartbeat(
  knex: Knex,
  heartbeatQuery = HEARTBEAT_QUERIES.DEFAULT
): Promise<HeartbeatResult> {
  if (!knex) {
    throw new Error('Knex is mandatory parameter')
  }

  return knex
    .raw(heartbeatQuery)
    .then(() => {
      return {
        isOk: true,
      }
    })
    .catch((err: Error) => {
      return {
        isOk: false,
        error: err,
      }
    })
}
