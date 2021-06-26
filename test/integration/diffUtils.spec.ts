import { Knex } from 'knex'
import { getAllDbs, getKnexForDb } from './helpers/knexInstanceProvider'
import { createJoinTable, dropJoinTable } from './helpers/tableCreator'
import { updateJoinTable } from '../../lib/diffUtils'
import { generateAssets } from './helpers/entityGenerator'

describe('diffUtils integration', () => {
  getAllDbs().forEach((db) => {
    describe(db, () => {
      let knex: Knex
      beforeEach(async () => {
        knex = getKnexForDb(db)
        await createJoinTable(knex)
      })

      afterEach(async () => {
        await dropJoinTable(knex)
        await knex.destroy()
      })

      describe('updateJoinTable', () => {
        it('correctly inserts new entries', async () => {
          const newList = generateAssets(0, { orgId: 'kiberion', linkType: 'primaryAsset' }, 10)
          await updateJoinTable(knex, newList, {
            primaryKeyField: 'id',
            idFields: ['userId', 'orgId', 'linkType'],
            table: 'joinTable',
            chunkSize: 3,
            filterCriteria: {
              orgId: 'kiberion',
              linkType: 'primaryAsset',
            },
          })

          const result = await knex('joinTable').select('*')
          expect(result).toMatchSnapshot()
        })
      })
    })
  })
})
