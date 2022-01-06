import { effect } from '../effect'
import { reactive } from '../reactive'
describe('effect', () => {
  it('happy path', () => {
    const obj = reactive({
      a: 1,
    })
    let b
    effect(() => {
      b = obj.a + 1
    })
    expect(b).toBe(2)
    obj.a++
    expect(b).toBe(3)
  })
})
