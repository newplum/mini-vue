import { extend, isObject } from '../share'
import { track, trigger } from './effect'
import { reactive, ReactiveFlags, readonly, shallowReadonly } from './reactive'

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key)
    // 判断: isReactive
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    }
    // 判断：isReadonly
    if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    if (shallow) {
      return res
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

    if (!isReadonly) {
      // 依赖收集
      track(target, key)
    }
    return res
  }
}

function createSetter() {
  return function set(target, key, val) {
    const res = Reflect.set(target, key, val)
    // 触发依赖
    trigger(target, key)
    return res
  }
}

export const mutableHandlers = {
  get,
  set,
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, val) {
    console.warn(`readonly不能修改target: ${target}`)
    return true
  },
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, { get: shallowReadonlyGet })
