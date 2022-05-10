import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers'

export enum ReactiveFlags {
  IS_REACTIVE = '__v_is_reactive',
  IS_READONLY = '__v_is_readonly',
}

function createActiveObject(raw, handlers) {
  return new Proxy(raw, handlers)
}

export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers)
}

export function shallowReadonly(raw) {
  return createActiveObject(raw, shallowReadonlyHandlers)
}

export function isReactive(target) {
  return !!target[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(target) {
  return !!target[ReactiveFlags.IS_READONLY]
}

export function isProxy(target) {
  return isReactive(target) || isReadonly(target)
}