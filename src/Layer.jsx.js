/**
 * @file 功能性弹层组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var ReactDOM = require('react-dom');
    var renderSubtreeIntoContainer = require("react-dom").unstable_renderSubtreeIntoContainer;
    var util = require('./core/util');
    var noop = function () {};


    return React.createClass({


        // @override
        getDefaultProps: function () {
            return {
                isOpen: false,
                anchor: null,
                style: {},
                location: '',
                closeWithBodyClick: false,
                onOffset: noop,
                onMouseEnter: noop,
                onMouseLeave: noop,
                onBeforeOpen: noop,
                onRender: noop,
                onBeforeClose: noop,
                onClose: noop
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
            var me = this;
            var layer = document.createElement('div');
            var style = me.props.style || {};
            layer.className = 'fcui2-layer';
            for (var key in style) {
                if (!style.hasOwnProperty(key)) continue;
                layer.style[key] = style[key];
            }
            layer.style.left = '-9999px';
            layer.style.top = '-9999px';
            layer.addEventListener('mouseenter', function () {
                me.setState({mouseenter: true});
                typeof me.props.onMouseEnter === 'function' && me.props.onMouseEnter();
            });
            layer.addEventListener('mouseleave', function () {
                me.setState({mouseenter: false});
                typeof me.props.onMouseLeave === 'function' && me.props.onMouseLeave();
            });
            me.___layerContainer___ = layer;
            me.___layerAppended___ = false;
            window.addEventListener('click', me.bodyClickHandler);
            me.renderSubTree(me.props);
        },


        // @override
        componentWillReceiveProps: function(newProps) {
            this.renderSubTree(newProps);
        },


        // @override
        componentWillUnmount: function() {
            this.removeSubTree();
            window.removeEventListener('click', this.bodyClickHandler);
        },


        bodyClickHandler: function (e) {
            if (this.state.mouseenter || !this.___layerAppended___ || !this.props.closeWithBodyClick) return;
            this.removeSubTree();
        },


        close: function () {
            var evt = document.createEvent('UIEvents');
            evt.fcuiTarget = this;
            typeof this.props.onBeforeClose === 'function' && this.props.onBeforeClose(evt);
            if (evt.returnValue) {
                this.removeSubTree();
            }
            typeof this.props.onClose === 'function' && this.props.onClose();
        },


        renderSubTree: function (props) {
            if (!this.___layerContainer___ || !props.anchor) return;
            if (!props.isOpen && !this.___layerAppended___) return;
            // open
            var me = this;
            if (props.isOpen) {
                if (!this.___layerAppended___) {
                    document.body.appendChild(this.___layerContainer___);
                    this.___layerAppended___ = true;
                    typeof props.onBeforeOpen === 'function' && props.onBeforeOpen();
                }
                renderSubtreeIntoContainer(this, props.children, this.___layerContainer___, function () {
                    me.fixedPosition(props);
                    typeof props.onRender === 'function' && props.onRender();
                });
                return;
            }
            // close
            this.close();
        },


        fixedPosition: function (props) {

            props = props || this.props;
            var layer = this.___layerContainer___;
            var anchor = props.anchor;
            var layerLocation = props.location + '';
            var layerHeight = layer.offsetHeight;
            var layerWidth = layer.offsetWidth;
            var anchorHeight = anchor.offsetHeight;
            var anchorWidth = anchor.offsetWidth;
            var anchorPosition = util.getDOMPosition(anchor);
            var topIndex = layerLocation.indexOf('top');
            var bottomIndex = layerLocation.indexOf('bottom');
            var leftIndex = layerLocation.indexOf('left');
            var rightIndex = layerLocation.indexOf('right');
            var result = {
                left: -9999,
                top: -9999,
                isLeft: false,
                isTop: false
            }

            // 只在上方显示
            if (topIndex > -1 && bottomIndex < 0) { 
                result.top = anchorPosition.top - layerHeight;
                result.isTop = true;
            }
            // 只在下方显示
            else if (bottomIndex > -1 && topIndex < 0) {
                result.top = anchorPosition.top + anchorHeight - 1;
                result.isTop = false;
            }
            // 上方优先显示
            else if (topIndex < bottomIndex) { 
                result.top = (result.isTop = (anchorPosition.top - layerHeight > 0))
                    ? (anchorPosition.top - layerHeight)
                    : (anchorPosition.top + anchorHeight - 1);
            }
            // 下方优先显示
            else {
                result.top = (result.isTop =
                        (anchorPosition.y + anchorHeight + layerHeight >= document.documentElement.clientHeight))
                    ? (anchorPosition.top - layerHeight)
                    : (anchorPosition.top + anchorHeight - 1);
            }

            // 只在左侧显示
            if (leftIndex > -1 && rightIndex < 0) {
                result.left = anchorPosition.left + anchorWidth - layerWidth;
                result.isLeft = true;
            }
            // 只在右侧显示
            else if (rightIndex > -1 && leftIndex < 0) {
                result.left = anchorPosition.left;
                result.isLeft = false;
            }
            // 左侧优先显示
            else if (leftIndex < rightIndex) {
                result.left = (result.isLeft = (anchorPosition.left + anchorWidth - layerWidth > 0))
                    ? (anchorPosition.left + anchorWidth - layerWidth)
                    : (anchorPosition.left)
            }
            // 右侧优先显示
            else {
                result.left = (result.isLeft = (anchorPosition.x + layerWidth >= document.documentElement.clientWidth))
                    ? (anchorPosition.left + anchorWidth - layerWidth)
                    : (anchorPosition.left);
            }

            typeof props.onOffset === 'function' && props.onOffset(result);
            layer.style.left = result.left + 'px';
            layer.style.top = result.top + 'px';
        },


        removeSubTree: function () {
            if (!this.___layerAppended___) return;
            ReactDOM.unmountComponentAtNode(this.___layerContainer___);
            this.___layerContainer___.style.left = '-9999px';
            this.___layerContainer___.style.top = '-9999px';
            document.body.removeChild(this.___layerContainer___);
            this.___layerAppended___ = false;
            this.setState({mouseenter: false});
        },


        render: function () {
            return React.DOM.noscript();
        }
    });

});
