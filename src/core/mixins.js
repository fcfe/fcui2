define(function (require) {

    var util = require('./util');
    var React = require('react');
    var ReactDOM = require('react-dom');

    return {
        // 用于需要记录鼠标状态的组件，如layer
        mouseContainer: {
            mouseleave: function (e) {
                e.stopPropagation();
                this.setState({mouseover: false});
            },
            mouseenter: function (e) {
                e.stopPropagation();
                this.setState({mouseover: true});
            },
        },
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
        },
        // 用于含有layer浮层的容器
        layerContainer: {
            layerContainer: null,
            layerShow: function () {
                var me = this;
                if (me.layerContainer == null) {
                    me.layerContainer = document.createElement('div');
                    me.layerContainer.className = 'fcui2-layer'
                }
                if (me.layer || typeof me.props.layerContent !== 'function') return;
                document.body.appendChild(me.layerContainer);
                var props = {
                    parent: me,
                    datasource: me.props.datasource,
                    onAction: me.layerAction
                };
                var timer = null;
                if (typeof me.props.layerProps === 'object') {
                    for (var key in me.props.layerProps) {
                        if (props.hasOwnProperty('key')) continue;
                        props[key] = me.props.layerProps[key];
                    }
                }
                me.layer = ReactDOM.render(React.createElement(me.props.layerContent, props), me.layerContainer);
                timer = setInterval(fixedPosition, 5);
                function fixedPosition() {
                    var height = me.layerContainer.offsetHeight;
                    var container = me.refs.container;
                    var layer = me.layerContainer;
                    if (!me.state.mouseover || !container) {
                        clearInterval(timer);
                        return;
                    }
                    if (height === 0) return;
                    clearInterval(timer);
                    var pos = util.getDOMPosition(container);
                    var top = (pos.y + container.offsetHeight + height < document.documentElement.clientHeight)
                        ? (pos.y + container.offsetHeight) : (pos.y - height);
                    var left = pos.x;
                    layer.style.left = left + 'px';
                    layer.style.top = top + 'px';
                    timer = setInterval(autoHide, 1000);
                }
                function autoHide() {
                    if (me.layer == null) {
                        clearInterval(timer);
                        return;
                    }
                    if (me.state.mouseover || me.layer.state.mouseover) return;
                    clearInterval(timer);
                    me.layerHide();
                }
            },
            layerHide: function () {
                this.layer = null;
                try {
                    document.body.removeChild(this.layerContainer);
                } catch (e) {
                    // TODO
                }
            }
        }
    };
});
