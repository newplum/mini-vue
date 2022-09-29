import { isObject } from "../share/index";
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

  // 判断是否是slots: 组件类型+子节点是object
  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT && isObject(children)) {
    vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN
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
