import { publicInstanceProxyHandlers } from "./componentPublicInstance"

 export function createComponentInstance(vnode) {
   const componentInstance = {
     vnode,
     type: vnode.type,
     setupState: {}
   }
   return componentInstance
 }

 export function setupComponent(instance) {
    // TODO
    // initProps
    // initSlots

    // 初始化有状态的组件（函数式组件没有状态）
    setupStatefulComponent(instance)
 }

function setupStatefulComponent(instance: any) {
    // 将组件的状态挂载到组件实例中
    const Component = instance.type
    instance.proxy = new Proxy({_: instance}, publicInstanceProxyHandlers)
    const { setup } = Component
    if (setup) {
      const setupResult = setup()
      handleSetupResult(instance,setupResult)
    }
}
function handleSetupResult(instance,setupResult: any) {
  // setupResult 有可能是 function 或 object
  // 如果是 function，则说明是 render 函数
  // 如果是 object，添加到组件上下文中
  // TODO function

  if (typeof setupResult === 'object') {
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
  const Component = instance.type
  instance.render = Component.render
}

