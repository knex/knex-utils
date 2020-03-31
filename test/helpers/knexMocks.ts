type CatchBlock = (e: Error) => void

class MockKnex {
  protected catchBlock: CatchBlock
  constructor() {
    this.catchBlock = (e) => {
      throw e
    }
  }

  select() {
    return this
  }

  del() {
    return this
  }

  raw() {
    return this
  }

  update() {
    return this
  }

  from() {
    return this
  }

  leftJoin() {
    return this
  }

  andWhere() {
    return this
  }

  where() {
    return this
  }

  whereBetween() {
    return this
  }

  count() {
    return this
  }

  whereIn() {
    return this
  }

  orderBy() {
    return this
  }

  limit() {
    return this
  }

  offset() {
    return this
  }

  destroy(): Promise<any> {
    return Promise.resolve()
  }

  catch(catchBlock: CatchBlock) {
    this.catchBlock = catchBlock
    return this
  }
}

export class ThrowingMockKnex extends MockKnex {
  then() {
    const result = new Promise(() => {
      throw new Error('Stub exception')
    }).catch(this.catchBlock)

    return result
  }

  destroy(): Promise<any> {
    const result = new Promise(() => {
      throw new Error('Stub destroy exception')
    }).catch(this.catchBlock)

    return result
  }
}

export class ResolvingMockKnex extends MockKnex {
  then(fn: Function) {
    const result = new Promise((resolve) => {
      resolve(true)
    })
      .then(() => fn())
      .catch(this.catchBlock)

    return result
  }
}
