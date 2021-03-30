import { Knex } from 'knex'
import { checkHeartbeat } from '../../lib/heartbeatUtils'
import { getAllDbs, getKnexForDb } from './helpers/knexInstanceProvider'

describe('heartbeatUtils integration', () => {
  getAllDbs().forEach((db) => {
    describe(db, () => {
      let knex: Knex
      beforeEach(() => {
        knex = getKnexForDb(db)
      })

      afterEach(() => {
        return knex.destroy()
      })

      describe('checkHeartbeat', () => {
        it('passes heartbeat', async () => {
          const checkResult = await checkHeartbeat(knex)
          expect(checkResult).toEqual({
            isOk: true,
          })
        })
      })
    })
  })
})
