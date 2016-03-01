define(function (require) {

    var util = require('./util');
    var React = require('react');
    var ReactDOM = require('react-dom');

    return {
        // 用于随window resize进行特殊渲染处理的组件，如table header
        resizeContainer: {
            resizeTimer: null,
            resizeHandler: function () {
                if (typeof this.resizing === 'function') {
                    this.resizing();
                }
            }
        },
        // 用于含有随滚动条fixed dom的组件，如table，需要fixed header
        fixedContainer: {
            scrollTimer: null,
            scrollHandler: function () {
                this.scrolling();
            },
            scrolling: function () {
                if (!(this.props.fixedPosition instanceof Array)) return;
                var fixedArray = this.props.fixedPosition;
                for (var i = 0; i < fixedArray.length; i++) {
                    var obj = fixedArray[i];
                    var dom = this.refs[obj.ref];
                    if (!dom) continue;
                    obj.top = isNaN(obj.top) ? 0 : obj.top * 1;
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
            recordFixedDOMPosition: function () {
                if (!(this.props.fixedPosition instanceof Array)) return;
                var fixedArray = this.props.fixedPosition;
                for (var i = 0; i < fixedArray.length; i++) {
                    var obj = fixedArray[i];
                    var dom = this.refs[obj.ref];
                    if (!dom) continue;
                    var pos = util.getDOMPosition(dom);
                    dom.__className = dom.className;
                    dom.__posTop = pos.top;
                    dom.__zIndex = dom.style.zIndex;
                    dom.__top = dom.style.top;
                }
            }
        } 
    };
});
