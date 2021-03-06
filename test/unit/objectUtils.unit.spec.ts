import { copyWithoutUndefined, groupBy, isEmptyObject, pick } from '../../lib/objectUtils'

describe('objectUtils', () => {
  describe('copyWithoutUndefined', () => {
    it('Does nothing when there are no undefined fields', () => {
      const result = copyWithoutUndefined({
        a: 'a',
        b: '',
        c: ' ',
        d: null,
        e: {},
      })

      expect(result).toMatchSnapshot()
    })

    it('Removes undefined fields', () => {
      const result = copyWithoutUndefined({
        a: undefined,
        b: 'a',
        c: '',
        d: undefined,
        e: ' ',
        f: null,
        g: {},
        h: undefined,
      })

      expect(result).toMatchSnapshot()
    })
  })
})

describe('pick', () => {
  it('Picks specified fields', () => {
    const result = pick(
      {
        a: 'a',
        b: '',
        c: ' ',
        d: null,
        e: {},
      },
      ['a', 'c', 'e']
    )

    expect(result).toMatchSnapshot()
  })

  it('Ignores missing fields', () => {
    const result = pick(
      {
        a: 'a',
        b: '',
        c: ' ',
        d: null,
        e: {},
      },
      ['a', 'f', 'g']
    )

    expect(result).toMatchSnapshot()
  })

  describe('isEmptyObject', () => {
    it('Returns true for completely empty object', () => {
      const params = {}
      const result = isEmptyObject(params)
      expect(result).toBe(true)
    })

    it('Returns true for object with only undefined fields', () => {
      const params = { a: undefined }
      const result = isEmptyObject(params)
      expect(result).toBe(true)
    })

    it('Returns false for object with null', () => {
      const params = { a: null }
      const result = isEmptyObject(params)
      expect(result).toBe(false)
    })

    it('Returns false for non-empty object', () => {
      const params = { a: '' }
      const result = isEmptyObject(params)
      expect(result).toBe(false)
    })
  })

  describe('groupBy', () => {
    it('Correctly groups by values', () => {
      const input = [
        {
          id: 1,
          name: 'a',
        },
        {
          id: 2,
          name: 'c',
        },
        {
          id: 3,
          name: 'b',
        },
        {
          id: 4,
          name: 'a',
        },
      ]

      const result = groupBy(input, 'name')

      expect(result).toMatchSnapshot()
    })

    it('Correctly handles undefined', () => {
      const input = [
        {
          id: 1,
          name: '45',
        },
        {
          id: 2,
        },
        {
          id: 3,
        },
        {
          id: 4,
          name: '45',
        },
      ]

      const result = groupBy(input, 'name')

      expect(result).toMatchSnapshot()
    })
  })
})
