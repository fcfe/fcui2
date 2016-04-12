/**
 * @file 用于fixed 组件内部某个DOM position的mixin
 * @author Brian Li
 * @email lbxxlht@163.com
 *
 * 此mixin主要作用是固定组件内部某些DOM的位置
 */
define(function (require) {

    var util = require('../core/util');

    return {
        componentDidMount: function () {
            window.addEventListener('scroll', this.___scrollHandler___);
            this.___recordFixedDOMPosition___();
        },
        componentWillUnmount: function () {
            window.removeEventListener('scroll', this.___scrollHandler___);
        },
        ___scrollHandler___: function () {
            var conf = this.props.fixedPosition;
            if (!(conf instanceof Array)) return;
            for (var i = 0; i < conf.length; i++) {
                // 获取dom
                var obj = conf[i];
                var dom = this.refs[obj.ref];
                if (!dom || !dom.tagName || isNaN(obj.top)) continue;
                // 检查是否显示
                var parentNode = dom;
                var display = '';
                while (parentNode.tagName !== 'BODY') {
                    display = util.getStyle(parentNode, 'display');
                    if (display === 'none') break;
                    parentNode = parentNode.parentNode;
                }
                if (display === 'none') continue;
                // 检查位置并设置fixed
                var pos = util.getDOMPosition(dom);
                var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
                if (scrollY - dom.__posTop + obj.top < 0) {
                    dom.className = dom.__className;
                    dom.style.zIndex = dom.__zIndex;
                    dom.style.top = dom.__top
                }
                else if (pos.y < obj.top) {
                    dom.className = dom.__className + ' fcui2-fixed-with-scroll';
                    dom.style.top = obj.top + 'px';
                    dom.style.zIndex = obj.zIndex;
                }
            }
        },
        ___recordFixedDOMPosition___: function () {
            var conf = this.props.fixedPosition;
            if (!(conf instanceof Array)) return;
            for (var i = 0; i < conf.length; i++) {
                var obj = conf[i];
                var dom = this.refs[obj.ref];
                if (!dom || !dom.tagName) continue;
                var pos = util.getDOMPosition(dom);
                dom.__className = dom.className;
                dom.__posTop = pos.top;
                dom.__zIndex = dom.style.zIndex;
                dom.__top = dom.style.top;
            }
        }
    };
});
