import { render } from "./renderer"
import { createVnode } from "./vnode"

export function createApp(rootComponent) {
  return {
    mount (rootContainer) {
      if (typeof rootContainer === "string") {
        rootContainer = document.querySelector(rootContainer)
      }
      // 将组件转换成虚拟节点
      const vnode = createVnode(rootComponent)
      // 根据虚拟节点进行渲染
      render(vnode, rootContainer)
    }
  }
}