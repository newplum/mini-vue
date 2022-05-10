import { isReadonly, shallowReadonly } from "../reactive"

describe('shallowReadonly', () => {
  it('happy path', () => {
    const obj = shallowReadonly({foo: {a: 1}})
    expect(isReadonly(obj)).toBe(true)
    expect(isReadonly(obj.foo)).toBe(false)
  })
})