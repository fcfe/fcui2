/**
 * 弹层
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var ReactDOM = require('react-dom');
    var renderSubtreeIntoContainer = require('react-dom').unstable_renderSubtreeIntoContainer;
    var tools = require('./core/layerTools');
    var util = require('./core/util');
    var noop = function () {};


    return React.createClass({
        /**
         * @properties
         * @param {String} className 添加到layer容器上类，此容器为内部容器，将添加到body中，是layer content根容器的外壳
         * @param {String} skin 添加到layer容器上的皮肤
         * @param {String} style 添加到layer容器上的样式表
         * @param {Boolean} isOpen layer是否显示，如果为true，layer容器将被添加到body中
         * @param {HtmlElement} anchor <required>layer定位的锚点，只有设置了锚点，layer才会显示，就是说这项是必须的
         * @param {String} location layer位置配置，配置方法见：src\core\layerTools.js
         * @param {Boolean} closeWithBodyClick layer展开后，点击屏幕其他位置，layer是否自动关闭，默认false
         * @param {Boolean} fixedWidthToAnchor 当layer宽度小于anchor时，是否根据anchor自适应宽度，默认true
         * @param {Function} onOffset layer展开后计算出显示位置，调用此回调，此回调可以对显示位置进行修正，指针方法
         * @param {Function} onMouseEnter 鼠标滑入layer时的回调
         * @param {Function} onMouseLeave 鼠标滑出layer时的回调
         * @param {Function} onRender layer渲染完成后的回调
         * @param {Function} onClose layer关闭后的回调
         * @param {Function} onBeforeCloseByWindow 屏幕其他位置关闭前的回调
         * @param {Function} onCloseByWindow 屏幕其他位置被点击导致layer关闭后触发的回调，只有closeWithBodyClick为true时有效
         */
        /**
         * @fire layer onOffset
         * @param {Object} e 内部计算出的浮层将要显示的位置，可以对此对象进行指针操作
         * @param {Number} e.left 浮层相对body的左边距
         * @param {Number} e.top 浮层相对body的上边距
         * @param {String} e.clockPosition 1-12的字符串或空串，表示浮层相对锚点的时钟位置，具体见src\core\layerTools.js
         */
        /**
         * @fire layer onMouseEnter
         *
         */
        // @override
        getDefaultProps: function () {
            return {
                skin: '',
                className: '',
                style: {},
                isOpen: false,
                anchor: null,
                location: '',
                closeWithBodyClick: false,
                fixedWidthToAnchor: true,
                onOffset: noop,
                onMouseEnter: noop,
                onMouseLeave: noop,
                onRender: noop,
                onClose: noop,
                onBeforeCloseByWindow: noop,
                onCloseByWindow: noop
            };
        },
        // @override
        getInitialState: function () {
            return {
                mouseenter: false
            };
        },
        // @override
        componentDidMount: function () {
            if (!window || !document) return;
            var layer = document.createElement('div');
            layer.style.left = '-9999px';
            layer.style.top = '-9999px';
            // 挂接容器事件和全局事件
            layer.addEventListener('mouseenter', this.onLayerMouseEnter);
            layer.addEventListener('mouseleave', this.onLayerMouseLeave);
            // 记录实例变量
            this.___layerContainer___ = layer;
            this.___layerAppended___ = false;
            this.___workerTimer___ = null;
            this.___anchorPosition___ = '';
            // 渲染子树
            this.fixedContainer(this.props);
            this.renderSubTree(this.props);
        },
        // @override
        componentWillReceiveProps: function(newProps) {
            this.renderSubTree(newProps);
            this.fixedContainer(newProps);
        },
        // @override
        componentWillUnmount: function() {
            var layer = this.___layerContainer___;
            layer.___sizeFixed___ = false;
            layer.removeEventListener('mouseenter', this.onLayerMouseEnter);
            layer.removeEventListener('mouseleave', this.onLayerMouseLeave);
            this.removeSubTree();
        },
        onLayerMouseEnter: function () {
            this.setState({mouseenter: true});
            typeof this.props.onMouseEnter === 'function' && this.props.onMouseEnter();
        },
        onLayerMouseLeave: function () {
            this.setState({mouseenter: false});
            typeof this.props.onMouseLeave === 'function' && this.props.onMouseLeave();
        },
        onBodyClick: function (e) {
            if (this.state.mouseenter || !this.props.closeWithBodyClick) return;
            e.returnValue = true;
            typeof this.props.onBeforeCloseByWindow === 'function' && this.props.onBeforeCloseByWindow(e);
            if (e.returnValue) {
                this.removeSubTree();
                typeof this.props.onCloseByWindow === 'function' && this.props.onCloseByWindow();
            }
        },
        onWorkerRunning: function () {
            if (!this.props.isOpen) {
                clearInterval(this.___workerTimer___);
                return;
            }
            var pos = util.getDOMPosition(this.props.anchor);
            pos = pos.x + ';' + pos.y + ';' + pos.left + ';' + pos.top;
            if (this.___anchorPosition___ !== pos) {
                this.fixedPosition(this.props);
            }
        },
        renderSubTree: function (props) {
            if (!this.___layerContainer___ || !props.anchor) return;
            if (!props.isOpen && !this.___layerAppended___) return;
            // open
            var me = this;
            if (props.isOpen) {
                if (!this.___layerAppended___) {
                    document.body.appendChild(this.___layerContainer___);
                }
                renderSubtreeIntoContainer(this, props.children, this.___layerContainer___, function () {
                    me.fixedSize(props);
                    me.fixedPosition(props);
                    if (!me.___layerAppended___) {
                        me.___layerAppended___ = true;
                        typeof props.onRender === 'function' && props.onRender();
                        setTimeout(function () {
                            window.addEventListener('click', me.onBodyClick);
                        }, 100);
                        // 滚动条太恶心了，挂scroll永远解决不了layer和anchor脱离的问题
                        // 因为我根本就不知道sroll到底是哪里引起的
                        // 所以我他喵的准备用轮询，不要怪我。
                        me.___workerTimer___ = setInterval(function () {
                            me.onWorkerRunning();
                        }, 10);
                    }
                });
                return;
            }
            // close
            this.removeSubTree();
            typeof this.props.onClose === 'function' && this.props.onClose();
        },
        removeSubTree: function () {
            if (!this.___layerAppended___) return;
            ReactDOM.unmountComponentAtNode(this.___layerContainer___);
            this.___layerContainer___.style.left = '-9999px';
            this.___layerContainer___.style.top = '-9999px';
            document.body.removeChild(this.___layerContainer___);
            window.removeEventListener('click', this.onBodyClick);
            clearInterval(this.___workerTimer___);
            this.___layerAppended___ = false;
            this.setState({mouseenter: false});
        },
        fixedContainer: function (props) {
            if (!this.___layerContainer___) return;
            var layer = this.___layerContainer___;
            var style = props.style || {};
            var className = typeof props.className === 'string' ? (' ' + props.className) : '';
            var skin = ' fcui2-layer-' +
                (typeof props.skin === 'string' && props.skin.length ? props.skin : 'normal')
            layer.className = 'fcui2-layer' + className + skin;
            for (var key in style) {
                if (!style.hasOwnProperty(key)) continue;
                layer.style[key] = style[key];
            }
        },
        fixedSize: function (props) { 
            // layer默认宽度会固定，高度自适应；如果修改宽度，可在props.style里修改
            var layer = this.___layerContainer___;
            var width = layer.offsetWidth;
            var height = layer.offsetHeight;
            if (layer.scrollHeight > layer.offsetHeight) {
                width += 20;
            }
            if (props.fixedWidthToAnchor && width < props.anchor.offsetWidth) {
                width = props.anchor.offsetWidth - 2;
            }
            if (!layer.___sizeFixed___) {
                layer.___sizeFixed___ = true;
                if (props.hasOwnProperty('style') && props.style.hasOwnProperty('width')) {
                    // DO NOTHING
                }
                else {
                    layer.style.width = width + 'px'; 
                }  
            }
        },
        fixedPosition: function (props) {
            var layer = this.___layerContainer___;
            var pos = tools.getLayerPosition(layer, props.anchor, props.location + '');
            typeof props.onOffset === 'function' && props.onOffset(pos);
            layer.style.left = pos.left + 'px';
            layer.style.top = pos.top + 'px';
            var anchorPos = util.getDOMPosition(props.anchor);
            this.___anchorPosition___ = anchorPos.x + ';' + anchorPos.y + ';' + anchorPos.left + ';' + anchorPos.top;
        },
        render: function () {
            return React.DOM.noscript();
        }
    });

});
