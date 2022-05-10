import { computed } from "../computed"
import { reactive } from "../reactive"

describe('computed', () => {
  it('happy path', () => {
    const user = reactive({
      age: 10
    })
    const age = computed(() => {
      return user.age
    })
    expect(age.value).toBe(10)
  })

  it('should compute lazily', () => {
    const user = reactive({age: 10})
    const getter = jest.fn(() => user.age)
    const cValue = computed(getter)

    // lazy
    expect(getter).not.toHaveBeenCalled()

    expect(cValue.value).toBe(10)
    expect(getter).toHaveBeenCalledTimes(1)

    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)

    user.age = 20
    expect(getter).toHaveBeenCalledTimes(1)
    
    expect(cValue.value).toBe(20)
    expect(getter).toHaveBeenCalledTimes(2)
  })
})