import { extend } from '../share'

let activeEffect: ReactiveEffect
let shouldTrack = false

class ReactiveEffect {
  deps: Array<Set<ReactiveEffect>> = []
  active = true
  onStop?: () => void
  constructor(private _fn: any, public scheduler) {}
  run() {
    if (!this.active) {
      return this._fn()
    }
    shouldTrack = true
    activeEffect = this
    const result = this._fn()
    shouldTrack = false
    return result
  }
  stop() {
    if (this.active) {
      cleanupEffect(this)
      this.active = false
      this.onStop && this.onStop()
    }
  }
}

/**
 * 清除依赖关系
 * @param effect 
 */
function cleanupEffect(effect: ReactiveEffect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect)
  })
  effect.deps.length = 0
}


/**
 * 响应式对象的副作用函数
 * @param fn 
 * @param options 
 * @returns 
 */
export function effect(fn, options: any = {}) {
  const effect = new ReactiveEffect(fn, options.scheduler)
  extend(effect, options)
  effect.run()
  const runner: any = effect.run.bind(effect)
  runner.effect = effect
  return runner
}

// 使用 Map 数据结构存储响应式对象对应的依赖集 e.g: [{obj1=>map1}, {obj2=>map2}]
const targetMap = new Map() 

/**
 * 收集依赖
 * @param target 
 * @param key 
 * @returns 
 */
export function track(target, key) {
  if (!isTracking()) return
  // 获取 target 对应的依赖关系(Map)
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    // 如果未获取到，则判断为第一次收集该 target 对象的依赖关系
    depsMap = new Map() // 新建一个 Map, 用于存储该 target 中所有 key 对应的依赖集合(Set)
    targetMap.set(target, depsMap) // 将新建的 Map 存储到 targetMap 中用于下次获取
  }
  // 获取该 target 中 key 对应的依赖集合(Set)
  let dep: Set<ReactiveEffect> = depsMap.get(key)
  if (!dep) {
    // 逻辑同上
    dep = new Set()
    depsMap.set(key, dep)
  }
  if (dep.has(activeEffect)) return
  dep.add(activeEffect) // 将 activeEffect 对象存到 dep 中，用于在 set 时调用
  activeEffect.deps.push(dep) // 将 dep 存到 activeEffect 对象中， 用于 stop 时删除依赖关系
}

function isTracking () {
  return shouldTrack && activeEffect !== undefined
}

/**
 * 触发依赖
 * @param target 
 * @param key 
 */
export function trigger(target, key) {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  // 遍历该 dep 拿到所有的依赖关系，并执行
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

/**
 * 停止响应式数据的副作用
 * @param runner 
 */ 
export function stop(runner) {
  runner.effect.stop()
}
