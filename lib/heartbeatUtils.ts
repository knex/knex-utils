import Knex from 'knex'

export const HEARTBEAT_QUERIES = Object.freeze({
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

export type returnCallback<T> = (err?: any, result?: T) => any

export type CoinpaymentsRatesOpts = any
//export type returnCallback<T> = any
export type CoinpaymentsRatesResponse = any

export type CMDS = any

export class Something {
  public mapPayload<t>(x: any, y: any): any

  public rates(
    options?: CoinpaymentsRatesOpts | returnCallback<CoinpaymentsRatesResponse>,
    callback?: returnCallback
  ) {
    if (!options && !callback) {
      options = {}
    }
    if (typeof options === 'function') {
      callback = options
      options = {}
    }
    const requestPayload = mapPayload<CoinpaymentsRatesOpts>(options, {
      cmd: CMDS.RATES,
    })

    return {}
  }
}
