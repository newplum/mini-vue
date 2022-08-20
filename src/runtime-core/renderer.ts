import { isObject } from "../share/index"
import { createComponentInstance, setupComponent } from "./component"
import { ShapeFlags } from "./ShapeFlags"

export function render (vnode, container) {
  patch(vnode, container)
}

function patch(vnode: any, container: any) {
  // 判断是 element 类型 还是 component 类型
  const {shapeFlag} = vnode

  //TODO 处理 element 类型
  if (shapeFlag & ShapeFlags.ELEMENT) {
    processElement(vnode, container)
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    // 处理 component 类型
    processComponent(vnode, container)
  }
  
}

function processElement(vnode: any, container: any) {
  // 处理 element 类型分为两种情况
  // 1. 初始化
  mountElement(vnode, container)
  //TODO 2. 更新
}


function mountElement(vnode: any, container: any) {
  const {type, props, children, shapeFlag} = vnode
  // 创建真实的dom
  const el = (vnode.el = document.createElement(type))
  // 添加属性
  const isOn = (key: string) => /^on[A-Z]/.test(key)
  for (const key in props) {
    if (props.hasOwnProperty(key)) {
      if (isOn(key)) {
        const eventName = key.slice(2).toLowerCase()
        el.addEventListener(eventName, props[key])
      } else {
        el.setAttribute(key, props[key])
      }
    }
  }
  // 渲染子节点
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    // 子节点为文本节点
    el.textContent = children
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // 子节点为数组
    mountChildren(children, el)
  }

  // 挂载到container
  container.appendChild(el)
}

function mountChildren(children: any[], el: any) {
    children.forEach(child => {
      patch(child, el)
    })
}

function processComponent(vnode: any, container: any) {
  // 将组件挂载到container
  mountComponent(vnode, container)
}

function mountComponent(initialVNode: any, container) {
  // 创建组件实例
  const instance = createComponentInstance(initialVNode)
  setupComponent(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance: any, container) {
  const { proxy, vnode } = instance
  const subTree = instance.render.call(proxy)
  patch(subTree, container)
  
  vnode.el = subTree.el
}



