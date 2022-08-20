'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var publicPropertiesMap = {
    $el: function (instance) { return instance.vnode.el; }
};
var publicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        var setupState = instance.setupState;
        if (key in setupState) {
            return setupState[key];
        }
        var publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function createComponentInstance(vnode) {
    var componentInstance = {
        vnode: vnode,
        type: vnode.type,
        setupState: {}
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
    instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers);
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

var ShapeFlags;
(function (ShapeFlags) {
    ShapeFlags[ShapeFlags["ELEMENT"] = 1] = "ELEMENT";
    ShapeFlags[ShapeFlags["STATEFUL_COMPONENT"] = 2] = "STATEFUL_COMPONENT";
    ShapeFlags[ShapeFlags["TEXT_CHILDREN"] = 4] = "TEXT_CHILDREN";
    ShapeFlags[ShapeFlags["ARRAY_CHILDREN"] = 8] = "ARRAY_CHILDREN";
})(ShapeFlags || (ShapeFlags = {}));

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    // 判断是 element 类型 还是 component 类型
    var shapeFlag = vnode.shapeFlag;
    //TODO 处理 element 类型
    if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container);
    }
    else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        // 处理 component 类型
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    // 处理 element 类型分为两种情况
    // 1. 初始化
    mountElement(vnode, container);
    //TODO 2. 更新
}
function mountElement(vnode, container) {
    var type = vnode.type, props = vnode.props, children = vnode.children, shapeFlag = vnode.shapeFlag;
    // 创建真实的dom
    var el = (vnode.el = document.createElement(type));
    // 添加属性
    for (var key in props) {
        if (props.hasOwnProperty(key)) {
            el.setAttribute(key, props[key]);
        }
    }
    // 渲染子节点
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        // 子节点为文本节点
        el.textContent = children;
    }
    else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
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
function processComponent(vnode, container) {
    // 将组件挂载到container
    mountComponent(vnode, container);
}
function mountComponent(initialVNode, container) {
    // 创建组件实例
    var instance = createComponentInstance(initialVNode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    var proxy = instance.proxy, vnode = instance.vnode;
    var subTree = instance.render.call(proxy);
    patch(subTree, container);
    vnode.el = subTree.el;
}

function createVnode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        el: null,
        shapeFlag: getShapeFlags(type)
    };
    if (typeof children === 'string') {
        vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
    }
    return vnode;
}
var getShapeFlags = function (type) {
    if (typeof type === 'string') {
        return ShapeFlags.ELEMENT;
    }
    else {
        return ShapeFlags.STATEFUL_COMPONENT;
    }
};

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

exports.createApp = createApp;
exports.h = h;
