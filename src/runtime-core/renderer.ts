import { createComponentInstance, setupComponent } from "./component"

export function render (vnode, container) {
  patch(vnode, container)
}

function patch(vnode: any, container: any) {
  // 判断是 element 类型 还是 component 类型

  //TODO 处理 element 类型
  
  // 处理 component 类型
  processComponent(vnode, container)
}

function processComponent(vnode: any, container: any) {
  // 将组件挂载到container
  mountComponent(vnode, container)
}

function mountComponent(vnode: any, container) {
  // 创建组件实例
  const instance = createComponentInstance(vnode)
  setupComponent(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance: any, container) {
  const subTree = instance.render()
  patch(subTree, container)
}

