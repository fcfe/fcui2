/**
 * @file全局工具集
 * 原则上，这里放置通用工具，跨组件使用，甚至可以跨框架使用
 */
define(function (require) {
    var exports = {

        /**
         * 绑定函数上下文
         *
         * @param {Function} func 需要绑定的函数
         * @param {Object} me 绑定到函数的上下文
         * @return {Function} 通过闭包形式返回上下文绑定好的函数。
         */
        bind: function (func, me) {
            return function () {
                return func.apply(me, arguments);
            };
        },

        /**
         * 获取dom某个css属性，不论这个属性是写在style里的，还是通过css设置的
         *
         * @param {HtmlElement} dom dom节点
         * @param {string} attr style属性名称，驼峰格式
         * @return {*} 对应的属性值
         */
        getStyle: function (dom, attr) {
            return dom.currentStyle ? dom.currentStyle[attr] : document.defaultView.getComputedStyle(dom, null)[attr];
        },

        /**
         * 获取dom节点的位置
         *
         * @param {HtmlElement} e dom节点
         * @return {Object} 位置对象，left、top相对于body左上角；x、y相对于可见区域左上角;
         */
        getDOMPosition: function (e) {
            var t = e.offsetTop;
            var l = e.offsetLeft;
            var isFixed = false;
            while (e = e.offsetParent) {
                if (this.getStyle(e, 'position') === 'fixed') isFixed = true;
                t += e.offsetTop;
                l += e.offsetLeft;
            }
            var pos = {
                x: l - (isFixed ? 0 : (document.documentElement.scrollLeft || document.body.scrollLeft)),
                y: t - (isFixed ? 0 : (document.documentElement.scrollTop || document.body.scrollTop)),
                left: l,
                top: t
            };
            return pos;
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
         * 生成function调用chain，从第一个functon开始调用，若返回true则中止调用链
         *
         * @param {Array} funcs funcs
         * @return {Function} chain函数
         */
        chainFunctions: function (...funcs) {
            return function (...args) {
                for (var i = 0; i < funcs.length; i++) {
                    var func = funcs[i];
                    if (func.apply(this, arguments)) return;
                }
            };
        }
    };

    return exports;
});
