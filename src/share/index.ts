export const extend = Object.assign

export const isObject = (val) => {
  return val !== null && typeof val === 'object'
}

export const hasChange = (newValue, oldValue) => {
  return !Object.is(newValue, oldValue)
}

export const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)

export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_matched: string, c: string) => c.toUpperCase())
}

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export  const toHandleKey = (str: string) => {
  return str ? `on${camelize(capitalize(str))}` : ""
}