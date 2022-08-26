import { toHandleKey } from "../share/index"

export const emit = (instance, eventName: string, ...args) => {

  const {props} = instance
  
  const handlerName = toHandleKey(eventName)

  const handler = props[handlerName]

  handler && handler(...args)
}