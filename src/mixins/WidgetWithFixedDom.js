/**
 * fixed组件内部DOM位置的mixin
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 * @note
 * ###说明文档
 * #####mixin作用
 * 当滚动条滚动到某个位置后，组件内部某些DOM可能会需要固定到屏幕的特定位置，比如表头，本mixin解决了这个问题
 * #####props依赖
 * this.props.fixedPosition {Array.<FixedObject>} 固定配置
 */
/**
 * @structure Import src\Table.jsx.js FixedObject
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
            typeof this.onWindowScroll === 'function' && this.onWindowScroll();
            if (!(conf instanceof Array)) return;
            this.oldDataHash = this.oldDataHash || {};
            for (var i = 0; i < conf.length; i++) {
                // 获取dom
                var obj = conf[i];
                var dom = this.refs[obj.ref];
                var oldData = this.oldDataHash[obj.ref];
                if (!dom || !dom.tagName || isNaN(obj.top) || !util.isDOMVisible(dom)) continue;
                // 未记录数据则记录数据
                if (!oldData) {
                    this.___recordFixedDOMPosition___();
                    oldData = this.oldDataHash[obj.ref] || {};
                }
                // 检查位置并设置fixed
                var pos = util.getDOMPosition(dom);
                var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
                var fixedClass = 'fcui2-fixed-with-scroll';
                if (scrollY - oldData.posTop + obj.top < 0) {
                    dom.className = dom.className.replace(/ fcui2-fixed-with-scroll/g, '');
                    dom.style.zIndex = oldData.zIndex;
                    dom.style.top = oldData.top;
                    typeof this.onDomPositionUnFixed === 'function' && this.onDomPositionUnFixed(obj.ref);
                }
                else if (pos.y < obj.top) {
                    dom.className += dom.className.indexOf(fixedClass) > -1 ? '' : ' ' + fixedClass;
                    dom.style.top = obj.top + 'px';
                    dom.style.zIndex = obj.zIndex;
                    typeof this.onDomPositionFixed === 'function' && this.onDomPositionFixed(obj.ref);
                }
            }
        },
        ___recordFixedDOMPosition___: function () {
            var conf = this.props.fixedPosition;
            if (!(conf instanceof Array)) return;
            for (var i = 0; i < conf.length; i++) {
                var obj = conf[i];
                var dom = this.refs[obj.ref];
                if (!dom || !dom.tagName) {
                    continue;
                }
                var pos = util.getDOMPosition(dom);
                this.oldDataHash = this.oldDataHash || {};
                this.oldDataHash[obj.ref] = {
                    posTop: pos.top,
                    zIndex: dom.style.zIndex,
                    top: dom.style.top
                }
            }
        }
    };
});
