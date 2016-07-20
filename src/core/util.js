/**
 * 全局工具集
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 * @note
 * 1. 此工具库所有方法，不但fcui2可以使用，其他任何项目都可以拿出去单独使用
 * 2. 此工具库不支持ES6语法，确保所有方法在所有浏览器基础环境中都能正确运行
 * 3. 不允许在此工具集中引入或使用或合并其他任何库，比如underscore, jQuery等
 * 4. 此工具集包含了操作原生DOM的方法，不能在node中使用
 * 5. 目前符合AMD规范，将来会支持CMD和直接引入
 */
define(function (require) {

    var exports = {

        /**
         * 获取浏览器类型
         * @interface getBrowserInfo
         * @return {String} 浏览器类型
         */
        getBrowserType: function () {
            // in NodeJS
            if (!(typeof window !== 'undefined' && window.document && window.document.createElement)) {
                return 'chrome';
            }
            // 按浏览器份额排序
            var ua = navigator.userAgent.toLowerCase();
            if (!!window.ActiveXObject || 'ActiveXObject' in window) {
                return 'ie';
            }
            if (ua.indexOf("chrome") > -1) {
                return 'chrome';
            }
            if (ua.indexOf("firefox") > -1) {
                return 'firefox';
            }
            return 'other';
        },

        /**
         * 获取window下的某个namespace，如果不存在，则创建一个空对象
         * @interface getNamespace
         * @param {String} namespace 命名空间名称
         * @return {Object} 命名空间
         */
        getNamespace: function (namespace) {
            window[namespace] = window.hasOwnProperty(namespace) ? window[namespace] : {};
            return window[namespace];
        },

        /**
         * 绑定函数上下文
         * @interface bind
         * @param {Function} func 需要绑定的函数
         * @param {Object} me 绑定到函数的上下文
         * @return {Function} 通过闭包形式返回上下文绑定好的函数
         */
        bind: function (func, me) {
            return function () {
                return func.apply(me, arguments);
            };
        },

        /**
         * 获取dom某个css属性，不论这个属性是写在style里的，还是通过css设置的
         * @interface getStyle
         * @param {HtmlElement} dom dom节点
         * @param {string} attr style属性名称，驼峰命名
         * @return {Any} 属性值
         */
        getStyle: function (dom, attr) {
            return dom.currentStyle ? dom.currentStyle[attr] : document.defaultView.getComputedStyle(dom, null)[attr];
        },

        /**
         * 获取输入框光标位置
         * @interface getCursorPosition
         * @param {HtmlElement} dom 正在输入的dom元素
         * @return {number} 鼠标位置，如果为-1，表示dom没有获得焦点 
         */
        getCursorPosition: function (dom) {
            var result = -1;
            // 非IE浏览器
            if (dom.selectionStart !== undefined) {
                result = dom.selectionStart;
            }
            // IE
            else {
                var range = document.selection.createRange();
                range.moveStart('character', -dom.value.length);
                result = range.text.length;
            }
            return result;
        },

        /**
         * 设置输入框中光标位置
         * @interface setCursorPosition
         * @param {HtmlElement} dom 正在输入的dom元素
         * @param {number} pos 光标位置
         */
        setCursorPosition: function (dom, pos) {
            // 非IE浏览器
            if(dom.setSelectionRange) {
                dom.focus();
                dom.setSelectionRange(pos, pos);
            }
            // IE
            else if (dom.createTextRange) {
                var range = dom.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos)
                range.moveStart('character', pos);
                range.select();
            }
        },

        /** 
         * 获取DOM是否可见，组件自身或者祖先中，只要visibility:hidden或display:none，即为不可见
         * @interface isDOMVisible
         * @param {HtmlElement} dom dom节点
         * @return {Boolean} 检查结果
         */
        isDOMVisible: function (dom) {
            if (!dom) return false;
            var initDOM = dom;
            while (dom && dom.tagName !== 'BODY') {
                if (this.getStyle(dom, 'visibility') === 'hidden' || this.getStyle(dom, 'display') === 'none') {
                    return false;
                }
                dom = dom.parentNode;
            }
            dom = initDOM;
            while (dom) {
                if (dom.offsetWidth === 0 || dom.offsetWidth === 0) {
                    return false;
                }
                dom = dom.offsetParent;
            }
            return true;
        },

        /**
         * 获取dom节点的位置
         * @interface getDOMPosition
         * @param {HtmlElement} e dom节点
         * @return {PositionState} 位置对象
         */
        /**
         * @structure PositionState
         * @param {Number} left dom相对于body左侧距离
         * @param {Number} top dom相对于body右侧距离
         * @param {Number} x dom相对于可视区域左侧距离
         * @param {Number} y dom相对于可视区域右侧距离
         */
        getDOMPosition: function (e) {
            var initDom = e;
            var t = e.offsetTop;   
            var l = e.offsetLeft;
            var isFixed = this.getStyle(e, 'position') === 'fixed';
            while (e = e.offsetParent) {
                t += e.offsetTop;   
                l += e.offsetLeft; 
                isFixed = isFixed || this.getStyle(e, 'position') === 'fixed';           
            }
            e = initDom;
            while((e = e.parentNode) && e.tagName !== 'BODY') {
                t -= e.scrollTop;
                l -= e.scrollLeft;
            }
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
            var pos = {
                x: l + (isFixed ? 0 : -scrollLeft),
                y: t + (isFixed ? 0 : -scrollTop),
                left: l + (isFixed ? scrollLeft : 0),
                top: t + (isFixed ? scrollTop : 0)
            };
            return pos;
        },

        /**
         * 获取DOM节点dataset，主要为了兼容最老版本的IE9
         * @interface getDataset
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
         * 将时间对象根据指定格式返回
         * @interface dateFormat
         * @param {Object} date 时间对象
         * @param {string} tpl 格式串：Y年;M月;D日;h小时;m分;s秒;S毫秒
         * @return {string} 根据tpl格式化好的事件
         */
        dateFormat: function (date, tpl) { //author: meizz
            if (!(date instanceof Date)) return date;
            date = date || new Date();
            tpl = tpl || 'YYYY-MM-DD hh:mm:ss';
            var o = {
                'M+': date.getMonth() + 1, //月份 
                'D+': date.getDate(), //日 
                'h+': date.getHours(), //小时 
                'm+': date.getMinutes(), //分 
                's+': date.getSeconds(), //秒 
                'S+': date.getMilliseconds() //毫秒 
            };
            if (/(Y+)/.test(tpl)) {
                tpl = tpl.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp('(' + k + ')').test(tpl)) {
                    tpl = tpl.replace(
                        RegExp.$1,
                        (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))
                    );
                }
            }
            return tpl;
        }
    };


    return exports;
});
