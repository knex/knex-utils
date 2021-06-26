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
        it('inserts new entries', async () => {
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
          expect(result.length).toEqual(newList.length)
          expect(result).toMatchObject([...newList])
        })

        it('removes removed entries', async () => {
          const oldList = generateAssets(0, { orgId: 'kiberion', linkType: 'primaryAsset' }, 10)
          await knex('joinTable').insert(oldList)

          const newList = generateAssets(10000, { orgId: 'kiberion', linkType: 'primaryAsset' }, 10)
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
          expect(result.length).toEqual(newList.length)
          expect(result).toMatchObject([...newList])
        })

        it('preserves existing entries', async () => {
          const oldList = generateAssets(0, { orgId: 'kiberion', linkType: 'primaryAsset' }, 10)
          await knex('joinTable').insert(oldList)

          const newList = generateAssets(10000, { orgId: 'kiberion', linkType: 'primaryAsset' }, 4)
          const mixedList = [oldList[0], ...newList]
          await updateJoinTable(knex, mixedList, {
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
          expect(result.length).toEqual(mixedList.length)
          expect(result).toMatchObject([...mixedList])
        })
      })
    })
  })
})
