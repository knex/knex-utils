import {
  copyWithoutUndefined,
  groupBy,
  isEmptyObject,
  pick,
  pickWithoutUndefined,
  strictPickWithoutUndefined,
  validateOnlyWhitelistedFieldsSet,
} from '../../lib/objectUtils'

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

  it('Includes undefined fields', () => {
    const result = pick(
      {
        a: 'a',
        b: undefined,
        c: {},
      },
      ['a', 'b']
    )

    expect(result).toMatchSnapshot()
  })
})

describe('pickWithoutUndefined', () => {
  it('Picks specified fields', () => {
    const result = pickWithoutUndefined(
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
    const result = pickWithoutUndefined(
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

  it('Skips undefined fields', () => {
    const result = pickWithoutUndefined(
      {
        a: 'a',
        b: undefined,
        c: {},
      },
      ['a', 'b']
    )

    expect(result).toMatchSnapshot()
  })
})

describe('strictPickWithoutUndefined', () => {
  it('Throws an error on excessive properties', () => {
    expect(() => {
      strictPickWithoutUndefined(
        {
          a: 'a',
          b: '',
          c: ' ',
          d: null,
          e: {},
        },
        ['a', 'c', 'e']
      )
    }).toThrowError(/Unsupported field: b/)
  })

  it('Picks exact set of properties', () => {
    const result = strictPickWithoutUndefined(
      {
        a: 'a',
        c: ' ',
        e: {},
      },
      ['a', 'c', 'e']
    )

    expect(result).toMatchSnapshot()
  })

  it('Ignores missing fields', () => {
    const result = strictPickWithoutUndefined(
      {
        a: 'a',
      },
      ['a', 'f', 'g']
    )

    expect(result).toMatchSnapshot()
  })

  it('Skips undefined fields', () => {
    const result = strictPickWithoutUndefined(
      {
        a: 'a',
        b: undefined,
      },
      ['a', 'b']
    )

    expect(result).toMatchSnapshot()
  })
})

describe('validateOnlyWhitelistedFieldsSet', () => {
  it('throws an error on excessive properties', () => {
    expect(() => {
      validateOnlyWhitelistedFieldsSet(
        {
          a: 'a',
          b: '',
          c: ' ',
          d: null,
          e: {},
        },
        new Set(['a', 'c', 'e'])
      )
    }).toThrowError(/Unsupported field: b/)
  })

  it('passes if there is exact match', () => {
    validateOnlyWhitelistedFieldsSet(
      {
        a: 'a',
        c: ' ',
        e: {},
      },
      new Set(['a', 'c', 'e'])
    )
  })

  it('passes if some fields are missing', () => {
    validateOnlyWhitelistedFieldsSet(
      {
        a: 'a',
      },
      new Set(['a', 'c', 'e'])
    )
  })
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
