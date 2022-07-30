import { isObject } from "../share/index"
import { createComponentInstance, setupComponent } from "./component"

export function render (vnode, container) {
  patch(vnode, container)
}

function patch(vnode: any, container: any) {
  // 判断是 element 类型 还是 component 类型

  //TODO 处理 element 类型
  if (typeof vnode.type === 'string') {
    processElement(vnode, container)
  } else if (isObject(vnode.type)) {
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
  const {type, props, children} = vnode
  // 创建真实的dom
  const el = (vnode.el = document.createElement(type))
  // 添加属性
  for (const key in props) {
    if (props.hasOwnProperty(key)) {
      el.setAttribute(key, props[key])
    }
  }
  // 渲染子节点
  if (typeof children === 'string') {
    // 子节点为文本节点
    el.textContent = children
  } else if (Array.isArray(children)) {
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



