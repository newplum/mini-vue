import { effect, stop } from '../effect'
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

  it('should return runner when call effect', () => {
    let foo = 1
    const runner = effect(() => {
      foo++
      return 'foo'
    })
    expect(foo).toBe(2)
    const result = runner()
    expect(foo).toBe(3)
    expect(result).toBe('foo')
  })

  it('scheduler', () => {
    let obj = reactive({
      a: 1,
    })
    let foo
    let run
    const scheduler = jest.fn(() => {
      run = runner
    })
    const runner = effect(
      () => {
        foo = obj.a
      },
      { scheduler }
    )
    expect(scheduler).not.toHaveBeenCalled()
    expect(foo).toBe(1)
    obj.a++
    expect(scheduler).toHaveBeenCalledTimes(1)
    expect(foo).toBe(1)
    run()
    expect(foo).toBe(2)
  })

  it('stop', () => {
    const obj = reactive({
      foo: 1,
    })
    let dummy
    const runner = effect(() => {
      dummy = obj.foo
    })
    obj.foo = 2
    expect(dummy).toBe(2)
    stop(runner)
    obj.foo++
    expect(dummy).toBe(2)
    runner()
    expect(dummy).toBe(3)
  })

  it('onStop', () => {
    const obj = reactive({ foo: 1 })
    let dummy
    const onStop = jest.fn(() => {})
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      {
        onStop,
      }
    )
    stop(runner)
    expect(onStop).toBeCalledTimes(1)
  })
})
