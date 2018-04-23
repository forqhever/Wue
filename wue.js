/**
 * Wue,仿照Vue实现双向绑定
 */
function Wue(options) {
    this._init(options);
}

/**
 * 初始化Wue，增加双向绑定
 * @param options
 * @private
 */
Wue.prototype._init = function (options) {
    this.$options = options;
    this.$el = document.querySelector(options.el);

    if(typeof options.data !== 'function') {
        console.warn('data must return an object!')
        return;
    }
    this.$data = options.data();
    this.$methods = options.methods;

    // _binding保存着model与view的映射关系，即Watcher的实例。
    // 当model改变时，会触发其中的指令类更新来保证view实时更新。
    this._binding = {};

    this._proxy(this.$data);
    this._observe(this.$data);
    this._compile(this.$el);
};

/**
 * 将data代理到Wue实例上
 */
Wue.prototype._proxy = function (data) {
    for(let key in data) {
        if(typeof data[key] === 'object') {
            this._proxy(data[key]);
        }
        Object.defineProperty(this, key, {
            enumerable: true,
            configurable: true,
            get: function () {
                return data[key];
            },
            set: function (newVal) {
                data[key] = newVal;
            }
        });
    }
};

/**
 * 实现data属性的观察者
 * @param obj
 * @private
 */
Wue.prototype._observe = function (obj) {
    let value;
    for(let key in obj) {
        if(obj.hasOwnProperty(key)) {

            this._binding[key] = {
                _watchers: []
            };

            let binding = this._binding[key];

            value = obj[key];
            if(typeof value === 'object') {
                this._observe(value);
            }
            Object.defineProperty(obj, key, {
                enumerable: true,
                configurable: true,
                get: function () {
                    console.log(`get ${key} : ${value}`);
                    return value;
                },
                set: function (newVal) {
                    if(value !== newVal) {
                        console.log(`update ${key} from ${value} to ${newVal}`);
                        value = newVal;
                        binding._watchers.forEach(function (watcher) {
                            watcher.update();
                        })
                    }
                }
            })
        }
    }
};

/**
 * 解析Wue对应的元素，对view与model进行绑定。
 * @param root
 * @private
 */
Wue.prototype._compile = function (root) {
    let _this = this;
    let nodes = root.children;
    for(let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        if(node.children.length) {
            this._compile(node);
        }

        /**
         * 给 w-click 指令对应的元素添加点击事件监听
         */
        if(node.hasAttribute('w-click')) {
            node.onclick = (function () {
                let attrVal = node.getAttribute('w-click');
                // bind是使data的作用域与method函数的作用域保持一致
                return _this.$methods[attrVal].bind(_this.$data);
            })();
        }

        /**
         * 给 w-model 指定对应的 input 或 textarea 元素添加绑定属性变化监听，同时添加输入事件监听
         */
        if(node.hasAttribute('w-model') &&
            (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA')) {
            let attrVal = node.getAttribute('w-model');
            _this._binding[attrVal]._watchers.push(new Watcher(
                node,
                'value',
                _this,
                attrVal
            ));
            node.addEventListener('input', (function (index) {
                return function () {
                    _this.$data[attrVal] = nodes[index].value;
                }
            })(i));
        }

        /**
         * 给 w-bind 指令对应的元素添加绑定属性变化监听
         */
        if(node.hasAttribute('w-bind')) {
            let attrVal = node.getAttribute('w-bind');
            _this._binding[attrVal]._watchers.push(new Watcher(
                node,
                'innerHTML',
                _this,
                attrVal
            ));
        }
    }
};

/**
 * 指令类Watcher，用来绑定更新函数，实现对DOM元素的更新
 * @param el    绑定的dom元素
 * @param attr  dom元素对应的属性
 * @param vm    Wue实例
 * @param exp   Wue实例的data中的属性
 * @constructor
 */
function Watcher(el, attr, vm, exp) {
    this.el = el;
    this.attr = attr;
    this.vm = vm;
    this.exp = exp;

    this.update();
}

/**
 * 当data属性改变时，会触发这个update函数，保证对应的DOM内容进行了更新。
 * 比如 h3.innerHTML = this.data.number;
 */
Watcher.prototype.update = function () {
    this.el[this.attr] = this.vm.$data[this.exp];
};