import { readonly } from '../reactive'

describe('readonly', () => {
  it('happy path', () => {
    // not set
    const origin = { foo: 1 }
    const obj = readonly(origin)
    expect(obj).not.toBe(origin)
    expect(obj.foo).toBe(1)
  })
  it('warn then call set', () => {
    console.warn = jest.fn()
    const obj = readonly({ foo: 1 })
    obj.foo = 2
    expect(console.warn).toBeCalled()
  })
})
