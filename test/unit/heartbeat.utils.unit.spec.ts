import { checkHeartbeat } from '../../lib/heartbeatUtils'
import { ResolvingMockKnex, ThrowingMockKnex } from './helpers/knexMocks'

describe('heartbeatUtils unit', () => {
  it('Get a DB error while connecting', async () => {
    const knex = new ThrowingMockKnex()
    const checkResult = await checkHeartbeat(knex as any)
    expect(checkResult.isOk).toEqual(false)
    expect(checkResult.error!.message).toEqual('Stub exception')
  })

  it('Do not get a DB error while connecting', async () => {
    const knex = new ResolvingMockKnex()
    const checkResult = await checkHeartbeat(knex as any)
    expect(checkResult).toEqual({
      isOk: true,
    })
  })
})
