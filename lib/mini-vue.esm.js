var isObject = function (val) {
    return val !== null && typeof val === 'object';
};

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
    instance.render = Component.render;
}

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    // 判断是 element 类型 还是 component 类型
    //TODO 处理 element 类型
    if (typeof vnode.type === 'string') {
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        // 处理 component 类型
        processComponent(vnode, container);
    }
}
function processComponent(vnode, container) {
    // 将组件挂载到container
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    // 创建组件实例
    var instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    var subTree = instance.render();
    patch(subTree, container);
}
function processElement(vnode, container) {
    // 处理 element 类型分为两种情况
    // 1. 初始化
    mountElement(vnode, container);
    //TODO 2. 更新
}
function mountElement(vnode, container) {
    var type = vnode.type, props = vnode.props, children = vnode.children;
    // 创建真实的dom
    var el = document.createElement(type);
    // 添加属性
    for (var key in props) {
        if (props.hasOwnProperty(key)) {
            el.setAttribute(key, props[key]);
        }
    }
    // 渲染子节点
    if (typeof children === 'string') {
        // 子节点为文本节点
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        // 子节点为数组
        mountChildren(children, el);
    }
    // 挂载到container
    container.appendChild(el);
}
function mountChildren(children, el) {
    children.forEach(function (child) {
        patch(child, el);
    });
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
            if (typeof rootContainer === "string") {
                rootContainer = document.querySelector(rootContainer);
            }
            // 将组件转换成虚拟节点
            var vnode = createVnode(rootComponent);
            // 根据虚拟节点进行渲染
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVnode(type, props, children);
}

export { createApp, h };
