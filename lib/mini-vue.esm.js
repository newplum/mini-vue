var extend = Object.assign;
var isObject = function (val) {
    return val !== null && typeof val === 'object';
};
var hasOwn = function (obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); };
var camelize = function (str) {
    return str.replace(/-(\w)/g, function (_matched, c) { return c.toUpperCase(); });
};
var capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
var toHandleKey = function (str) {
    return str ? "on".concat(camelize(capitalize(str))) : "";
};

// 使用 Map 数据结构存储响应式对象对应的依赖集 e.g: [{obj1=>map1}, {obj2=>map2}]
var targetMap = new Map();
/**
 * 触发依赖
 * @param target
 * @param key
 */
function trigger(target, key) {
    var depsMap = targetMap.get(target);
    var dep = depsMap.get(key);
    triggerEffect(dep);
}
function triggerEffect(dep) {
    // 遍历该 dep 拿到所有的依赖关系，并执行
    for (var _i = 0, dep_1 = dep; _i < dep_1.length; _i++) {
        var effect_1 = dep_1[_i];
        if (effect_1.scheduler) {
            effect_1.scheduler();
        }
        else {
            effect_1.run();
        }
    }
}

var get = createGetter();
var set = createSetter();
var readonlyGet = createGetter(true);
var shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly, shallow) {
    if (isReadonly === void 0) { isReadonly = false; }
    if (shallow === void 0) { shallow = false; }
    return function get(target, key) {
        var res = Reflect.get(target, key);
        // 判断: isReactive
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly;
        }
        // 判断：isReadonly
        if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly;
        }
        if (shallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, val) {
        var res = Reflect.set(target, key, val);
        // 触发依赖
        trigger(target, key);
        return res;
    };
}
var mutableHandlers = {
    get: get,
    set: set,
};
var readonlyHandlers = {
    get: readonlyGet,
    set: function (target, key, val) {
        console.warn("readonly\u4E0D\u80FD\u4FEE\u6539target: ".concat(target));
        return true;
    },
};
var shallowReadonlyHandlers = extend({}, readonlyHandlers, { get: shallowReadonlyGet });

var ReactiveFlags;
(function (ReactiveFlags) {
    ReactiveFlags["IS_REACTIVE"] = "__v_is_reactive";
    ReactiveFlags["IS_READONLY"] = "__v_is_readonly";
})(ReactiveFlags || (ReactiveFlags = {}));
function createActiveObject(raw, handlers) {
    if (!isObject(raw)) {
        console.warn("target ".concat(raw, " is not an object"));
        return raw;
    }
    return new Proxy(raw, handlers);
}
function reactive(raw) {
    return createActiveObject(raw, mutableHandlers);
}
function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandlers);
}

var emit = function (instance, eventName) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var props = instance.props;
    var handlerName = toHandleKey(eventName);
    var handler = props[handlerName];
    handler && handler.apply(void 0, args);
};

var initProps = function (instance, rawProps) {
    instance.props = rawProps || {};
};

var publicPropertiesMap = {
    $el: function (instance) { return instance.vnode.el; }
};
var publicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        var setupState = instance.setupState, props = instance.props;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
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
        setupState: {},
        props: {},
        emit: function () { }
    };
    componentInstance.emit = emit.bind(null, componentInstance);
    return componentInstance;
}
function setupComponent(instance) {
    initProps(instance, instance.vnode.props);
    // TODO
    // initSlots
    // 初始化有状态的组件（函数式组件没有状态）
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    // 将组件的状态挂载到组件实例中
    var Component = instance.type;
    instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers);
    var emit = instance.emit;
    var setup = Component.setup;
    if (setup) {
        var setupResult = setup(shallowReadonly(instance.props), { emit: emit });
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
    var isOn = function (key) { return /^on[A-Z]/.test(key); }; // 判断是不是 on开头的事件属性
    for (var key in props) {
        if (props.hasOwnProperty(key)) {
            if (isOn(key)) {
                var eventName = key.slice(2).toLowerCase();
                el.addEventListener(eventName, props[key]);
            }
            else {
                el.setAttribute(key, props[key]);
            }
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

export { createApp, h };
