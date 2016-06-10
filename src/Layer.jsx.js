/**
 * 弹层
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var ReactDOM = require('react-dom');
    var renderSubtreeIntoContainer = require("react-dom").unstable_renderSubtreeIntoContainer;
    var tools = require('./core/layerTools');
    var noop = function () {};


    return React.createClass({
        /**
         * @properties
         * @param {String} className 添加到layer容器上类，此容器为内部容器，将添加到body中，是layer content根容器的外壳
         * @param {String} skin 添加到layer容器上的皮肤
         * @param {String} style 添加到layer容器上的样式表
         * @param {Boolean} isOpen layer是否显示，如果为true，layer容器将被添加到body中
         * @param {HtmlElement} anchor <required>layer定位的锚点，只有设置了锚点，layer才会显示，就是说这项是必须的 
         * @param {String} location layer位置配置：'left right'从anchor右边框向左展开优先，屏幕位置不够，就从anchor左边框
         *  向右展开；'right left'则向右展开优先；top、bottom含义类似。 
         * @param {Boolean} closeWithBodyClick layer展开后，点击屏幕其他位置，layer是否自动关闭，默认false
         * @param {Boolean} fixedWidthToAnchor 当layer宽度小于anchor时，是否根据anchor自适应宽度，默认true
         * @param {Function} onOffset layer展开后计算出显示位置，调用此回调，此回调可以对显示位置进行修正，指针方法
         * @param {Function} onMouseEnter 鼠标滑入layer时的回调
         * @param {Function} onMouseLeave 鼠标滑出layer时的回调
         * @param {Function} onRender layer渲染完成后的回调
         * @param {Function} onClose layer关闭后的回调
         * @param {Function} onCloseByWindow 屏幕其他位置被点击导致layer关闭后触发的回调，只有closeWithBodyClick为true
         *  时有效
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
            var style = this.props.style || {};
            var className = typeof this.props.className === 'string' ? (' ' + this.props.className) : '';
            var skin = ' fcui2-layer-' +
                (typeof this.props.skin === 'string' && this.props.skin.length ? this.props.skin : 'normal')
            // 设置容器皮肤及样式
            layer.className = 'fcui2-layer' + className + skin;
            for (var key in style) {
                if (!style.hasOwnProperty(key)) continue;
                layer.style[key] = style[key];
            }
            layer.style.left = '-9999px';
            layer.style.top = '-9999px';
            // 挂接容器事件和全局事件
            layer.addEventListener('mouseenter', this.onLayerMouseEnter);
            layer.addEventListener('mouseleave', this.onLayerMouseLeave);
            window.addEventListener('click', this.onBodyClick);
            // 记录实例变量
            this.___layerContainer___ = layer;
            this.___layerAppended___ = false;
            this.___renderCount___ = 0;
            // 渲染子树
            this.renderSubTree(this.props);
        },
        // @override
        componentWillReceiveProps: function(newProps) {
            this.renderSubTree(newProps);
        },
        // @override
        componentWillUnmount: function() {
            var layer = this.___layerContainer___;
            layer.removeEventListener('mouseenter', this.onLayerMouseEnter);
            layer.removeEventListener('mouseleave', this.onLayerMouseLeave);
            window.removeEventListener('click', this.onBodyClick);
            this.___renderCount___ = 0;
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
            if (this.___renderCount___ === 1) {
                this.___renderCount___++;
                return;
            }
            this.removeSubTree();
            typeof this.props.onCloseByWindow === 'function' && this.props.onCloseByWindow();
        },
        renderSubTree: function (props) {
            if (!this.___layerContainer___ || !props.anchor) return;
            if (!props.isOpen && !this.___layerAppended___) return;
            // open
            var me = this;
            if (props.isOpen) {
                if (!this.___layerAppended___) {
                    this.___layerAppended___ = true;
                    document.body.appendChild(this.___layerContainer___);
                }
                renderSubtreeIntoContainer(this, props.children, this.___layerContainer___, function () {
                    me.fixedPosition(props);
                    typeof props.onRender === 'function' && props.onRender();
                    me.___renderCount___ ++;
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
            this.___layerAppended___ = false;
            this.___renderCount___ = 0;
            this.setState({mouseenter: false});
        },
        fixedPosition: function (props) {
            var layer = this.___layerContainer___;
            if (layer.scrollHeight > layer.offsetHeight && !layer.__expandWidth___) {
                layer.__expandWidth___ = true;
                layer.style.width = layer.offsetWidth + 20 + 'px';
            }
            if (props.fixedWidthToAnchor && layer.offsetWidth < props.anchor.offsetWidth) {
                layer.style.width = props.anchor.offsetWidth - 2 + 'px';
            }
            var pos = tools.getLayerPosition(layer, props.anchor, props.location + '');
            typeof props.onOffset === 'function' && props.onOffset(pos);
            layer.style.left = pos.left + 'px';
            layer.style.top = pos.top + 'px';
        },
        render: function () {
            return React.DOM.noscript();
        }
    });

});
