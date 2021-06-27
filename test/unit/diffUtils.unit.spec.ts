import { calculateEntityListDiff } from '../../lib/diffUtils'

describe('diffUtils', () => {
  describe('calculateEntityListDiff (single field)', () => {
    it('returns empty result for identical arrays', () => {
      const array1 = [{ id: 1 }, { id: 2 }]
      const array2 = [{ id: 2 }, { id: 1 }]

      const result = calculateEntityListDiff(array1, array2, ['id'])

      expect(result).toMatchSnapshot()
    })

    it('returns correct result for new entries', () => {
      const array1 = [{ id: 1 }, { id: 2 }]
      const array2 = [{ id: 2 }, { id: 1 }, { id: 3 }]

      const result = calculateEntityListDiff(array1, array2, ['id'])

      expect(result).toMatchSnapshot()
    })

    it('returns correct result for removed entries', () => {
      const array1 = [{ id: 1 }, { id: 2 }, { id: 3 }]
      const array2 = [{ id: 2 }, { id: 1 }]

      const result = calculateEntityListDiff(array1, array2, ['id'])

      expect(result).toMatchSnapshot()
    })

    it('returns correct result for both added and removed entries', () => {
      const array1 = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
      const array2 = [{ id: 2 }, { id: 1 }, { id: 5 }, { id: 6 }]

      const result = calculateEntityListDiff(array1, array2, ['id'])

      expect(result).toMatchSnapshot()
    })
  })

  describe('calculateEntityListDiff', () => {
    it('returns empty result for identical arrays', () => {
      const array1 = [
        { userId: 1, orgId: 1 },
        { userId: 2, orgId: 1 },
        { userId: 3, orgId: 2 },
      ]
      const array2 = [
        { userId: 1, orgId: 1 },
        { userId: 2, orgId: 1 },
        { userId: 3, orgId: 2 },
      ]

      const result = calculateEntityListDiff(array1, array2, ['userId', 'orgId'])

      expect(result).toMatchSnapshot()
    })

    it('returns correct result for new entries', () => {
      const array1 = [
        { userId: 1, orgId: 1 },
        { userId: 2, orgId: 1 },
      ]
      const array2 = [
        { userId: 1, orgId: 1 },
        { userId: 2, orgId: 1 },
        { userId: 3, orgId: 2 },
      ]

      const result = calculateEntityListDiff(array1, array2, ['userId', 'orgId'])

      expect(result).toMatchSnapshot()
    })

    it('returns correct result for removed entries', () => {
      const array1 = [
        { userId: 1, orgId: 1 },
        { userId: 2, orgId: 1 },
        { userId: 3, orgId: 2 },
      ]
      const array2 = [
        { userId: 1, orgId: 1 },
        { userId: 2, orgId: 1 },
      ]

      const result = calculateEntityListDiff(array1, array2, ['userId', 'orgId'])

      expect(result).toMatchSnapshot()
    })

    it('returns correct result for both added and removed entries', () => {
      const array1 = [
        { userId: 1, orgId: 1 },
        { userId: 2, orgId: 1 },
      ]
      const array2 = [
        { userId: 2, orgId: 1 },
        { userId: 3, orgId: 2 },
      ]

      const result = calculateEntityListDiff(array1, array2, ['userId', 'orgId'])

      expect(result).toMatchSnapshot()
    })
  })
})
