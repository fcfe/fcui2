/**
 * @file 功能性弹层组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var ReactDOM = require('react-dom');
    var renderSubtreeIntoContainer = require("react-dom").unstable_renderSubtreeIntoContainer;
    var tools = require('./core/layerTools');
    var noop = function () {};


    return React.createClass({


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
                onOffset: noop,
                onMouseEnter: noop,
                onMouseLeave: noop,
                onBeforeOpen: noop,
                onRender: noop,
                onBeforeClose: noop,
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
            // 设置容器皮肤及样式
            layer.className = 'fcui2-layer'
                + (typeof this.props.className === 'string' && this.props.className ? (' ' + this.props.className) : '')
                + (typeof this.props.skin === 'string' && this.props.skin ? (' fcui2-layer-' + this.props.skin) : '');
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


        close: function () {
            var evt = document.createEvent('UIEvents');
            evt.fcuiTarget = this;
            evt.returnValue = true;
            typeof this.props.onBeforeClose === 'function' && this.props.onBeforeClose(evt);
            if (evt.returnValue) {
                this.removeSubTree();
                typeof this.props.onClose === 'function' && this.props.onClose();
            }
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
                    typeof props.onBeforeOpen === 'function' && props.onBeforeOpen();
                }
                renderSubtreeIntoContainer(this, props.children, this.___layerContainer___, function () {
                    me.fixedPosition(props);
                    typeof props.onRender === 'function' && props.onRender();
                    me.___renderCount___ ++;
                });
                return;
            }
            // close
            this.close();
        },


        fixedPosition: function (props) {
            var layer = this.___layerContainer___;
            var pos = tools.getLayerPosition(layer, props.anchor, props.location + '');
            typeof props.onOffset === 'function' && props.onOffset(pos);
            layer.style.left = pos.left + 'px';
            layer.style.top = pos.top + 'px';
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


        render: function () {
            return React.DOM.noscript();
        }
    });

});
