function createComponentInstance(vnode) {
    var componentInstance = {
        vnode: vnode,
        type: vnode.type
    };
    return componentInstance;
}
function setupComponent(instance) {
    // TODO
    // initProps
    // initSlots
    // 初始化有状态的组件（函数式组件没有状态）
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    // 将组件的状态挂载到组件实例中
    var Component = instance.type;
    var setup = Component.setup;
    if (setup) {
        var setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // setupResult 有可能是 function 或 object
    // 如果是 function，则说明是 render 函数
    // 如果是 object，添加到组件上下文中
    // TODO function
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var Component = instance.type;
    if (!instance.render) {
        instance.render = Component.render;
    }
}

function render(vnode, container) {
    patch(vnode);
}
function patch(vnode, container) {
    // 判断是 element 类型 还是 component 类型
    //TODO 处理 element 类型
    // 处理 component 类型
    processComponent(vnode);
}
function processComponent(vnode, container) {
    // 将组件挂载到container
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    // 创建组件实例
    var instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    var subTree = instance.render();
    patch(subTree);
}

function createVnode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children
    };
    return vnode;
}

function createApp(rootComponent) {
    return {
        mount: function (rootContainer) {
            // 将组件转换成虚拟节点
            var vnode = createVnode(rootComponent);
            // 根据虚拟节点进行渲染
            render(vnode);
        }
    };
}

function h(type, props, children) {
    return createVnode(type, props, children);
}

export { createApp, h };
