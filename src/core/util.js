/**
 * @file 全局工具集
 * @author Brian Li
 * @email lbxxlht@163.com
 *
 * 此工具库所有方法，不但fcui2可以使用，其他任何项目都可以把它拿出去单独使用。
 * 此工具库不支持ES6语法，确保所有方法在所有浏览器基础环境中都能正确运行。
 * 不允许在此工具集中引入或使用或合并其他任何库，比如underscore, jQuery等。
 * 此工具集包含了操作原生DOM的方法，不能在node中使用。
 * 目前符合AMD规范，将来会支持CMD和直接引入。
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
                left: l + (!isFixed ? 0 : (document.documentElement.scrollLeft || document.body.scrollLeft)),
                top: t + (!isFixed ? 0 : (document.documentElement.scrollTop || document.body.scrollTop))
            };
            return pos;
        },

        /**
         * 获取DOM节点dataset，主要为了兼容最老版本的IE9
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
         * 将时间对象根据指定格式返回
         *
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
