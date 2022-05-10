import { isProxy, isReadonly, readonly } from '../reactive'

describe('readonly', () => {
  it('happy path', () => {
    const origin = { foo: 1 }
    const obj = readonly(origin)
    expect(obj).not.toBe(origin)
    expect(obj.foo).toBe(1)
    expect(isProxy(obj)).toBe(true)
  })
  it('warn then call set', () => {
    console.warn = jest.fn()
    const obj = readonly({ foo: 1 })
    obj.foo = 2
    expect(console.warn).toBeCalled()
  })
  it('is readonly', () => {
    const origin = { foo: 1 }
    const obj = readonly(origin)
    expect(isReadonly(obj)).toBe(true)
    expect(isReadonly(origin)).toBe(false)
  })
  it('nested readonly', () => {
    const original = {foo: {a: 1}, arr: [{b: 2}]}
    const observed = readonly(original)
    expect(isReadonly(observed.foo)).toBe(true)
    expect(isReadonly(observed.arr)).toBe(true)
    expect(isReadonly(observed.arr[0])).toBe(true)
  })
})
