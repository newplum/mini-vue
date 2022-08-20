import { ShapeFlags } from "./ShapeFlags";

export function createVnode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    el: null,
    shapeFlag: getShapeFlags(type)
  }

  if (typeof children === 'string') {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  }

  return vnode
}

export const getShapeFlags = (type) => {
  if (typeof type === 'string') {
    return ShapeFlags.ELEMENT
  } else {
    return ShapeFlags.STATEFUL_COMPONENT
  }
};
