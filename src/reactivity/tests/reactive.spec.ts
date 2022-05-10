import { isReactive, reactive, isProxy } from '../reactive'
describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const observed = reactive(original)
    expect(observed).not.toBe(original)
    expect(observed.foo).toBe(1)
    expect(isReactive(observed)).toBe(true)
    expect(isReactive(original)).toBe(false)
    expect(isProxy(observed)).toBe(true)
  })
  it('nested reactive', () => {
    const original = {foo: {a: 1}, arr: [{b: 2}]}
    const observed = reactive(original)
    expect(isReactive(observed.foo)).toBe(true)
    expect(isReactive(observed.arr)).toBe(true)
    expect(isReactive(observed.arr[0])).toBe(true)
  })
})
