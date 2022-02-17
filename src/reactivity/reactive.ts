import { mutableHandlers, readonlyHandlers } from './baseHandlers'

function createActiveObject(raw, handlers) {
  return new Proxy(raw, handlers)
}

export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers)
}
