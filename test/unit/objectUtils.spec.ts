import { copyWithoutUndefined, pick } from '../../lib/objectUtils'

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

describe('objectUtils', () => {
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
  })
})
