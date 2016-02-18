/**
 * @file全局工具集
 * 原则上，这里放置通用工具，跨组件使用，甚至可以跨框架使用
 */
define(function (require) {
    var exports = {
        /**
         * 获取dom节点的位置
         *
         * @param {HtmlElement} el dom节点
         * @return {Object} 位置对象，left、top相对于body左上角；x、y相对于可见区域左上角;
         */
        getDOMPosition: function (el) {
            var x = 0, y = 0;
            while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
                x += el.offsetLeft - el.scrollLeft;
                y += el.offsetTop - el.scrollTop;
                el = el.offsetParent;
            }
            return {
                x: x,
                y: y,
                left: x + document.body.scrollLeft,
                top: y + document.body.scrollTop
            }
        },

        /**
         * 获取DOM节点dataset，shit IE9
         *
         * @param {HtmlElement} dom dom节点
         * @return {Object} dataset数据集
         */
        getDataset: function (dom) {
            if (typeof dom.dataset !== 'undefined') {
                return dom.dataset;
            }
            var attrs = dom.attributes;
            var dataset = {};
            for (var i = 0; i < attrs.length; i++) {
                var item = attrs[i];
                var key = item.name;
                if (key.indexOf('data-') !== 0) {
                    continue;
                }
                key = key.slice(5, key.length).replace(/\-(\w)/g, function (all, letter) {
                    return letter.toUpperCase();
                });
                dataset[key] = item.value;
            }
            return dataset;
        },

        /**
         * 自动调整弹出浮层位置，只调整上下，不调整左右
         *
         * @param {HtmlElement} container layer外部的dom容器
         * @param {HtmlElement} layer layer根容器
         * @param {React Node} node layer所在的react组件
         */
        fixedLayerPositionTB: function (container, layer, node) {
            var pos = this.getDOMPosition(container);
            var timer = setInterval(function () {
                var height = layer.offsetHeight;
                if (height === 0) return;
                clearInterval(timer);
                var position = pos.y + container.offsetHeight + height < document.documentElement.clientHeight
                    ? 'bottom-layer' : 'up-layer';
                node.setState({layerPosition: position});
            }, 5);
        },

        /**
         * 生成function调用chain，从第一个functon开始调用，若返回true则中止调用链
         *
         * @param {Array} funcs funcs
         * @return {Function} chain函数
         */
        chainFunctions: function (...funcs) {
            return function (...args) {
                funcs.find((handler) => handler.apply(this, args));
            };
        },

        /**
         * 将freezer的update事件bind到React Component的setState中
         *
         * @param {Freezer} freezer freezer
         * @param {ReactComponent} theComponent The React component
         * @param {string} stateName stateName
         */
        bindFreezerAndComponent: function (freezer, theComponent, stateName) {
            freezer.on('update', () => {
                var newState = {};
                newState[stateName] = freezer.get();
                theComponent.setState(newState);
            });
        }
    };

    return exports;
});
