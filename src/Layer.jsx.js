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
                closeWithBodyClick: false,
                style: {},
                layerPosition: '',
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
            this.removeSubTree(true);
            window.removeEventListener('click', this.bodyClickHandler);
        },
        bodyClickHandler: function (e) {
            if (this.state.mouseenter || !this.___layerAppended___ || !this.props.closeWithBodyClick) return;
            this.removeSubTree();
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
                    me.renderSubTreeFinished(props)
                });
                return;
            }
            // close
            this.removeSubTree();
        },
        renderSubTreeFinished: function (props) {

            props = props || this.props;
            var layer = this.___layerContainer___;
            var anchor = props.anchor;
            var layerPosition = props.layerPosition + '';
            var layerHeight = layer.offsetHeight;
            var layerWidth = layer.offsetWidth;
            var layerTop = -9999;
            var layerLeft = -9999;
            var anchorHeight = anchor.offsetHeight;
            var anchorWidth = anchor.offsetWidth;
            var anchorPosition = util.getDOMPosition(anchor);

            if (layerPosition.indexOf('top') > -1) {
                layerTop = anchorPosition.top - layerHeight;
            }
            else if (layerPosition.indexOf('bottom') > -1) {
                layerTop = anchorPosition.top + anchorHeight - 1;
            }
            else {
                layerTop = (anchorPosition.y + anchorHeight + layerHeight < document.documentElement.clientHeight)
                    ? (anchorPosition.top + anchorHeight - 1) : (anchorPosition.top - layerHeight);
            }
            if (layerPosition.indexOf('left') > -1) {
                layerLeft = anchorPosition.left + anchorWidth - layerWidth;
            }
            else if (layerPosition.indexOf('right') > -1) {
                layerLeft = anchorPosition.left;
            }
            else {
                layerLeft = anchorPosition.x + layerWidth < document.documentElement.clientWidth ?
                    anchorPosition.left : (anchorPosition.left + anchorWidth - layerWidth);
            }

            layer.style.left = layerLeft + 'px';
            layer.style.top = layerTop + 'px';
            typeof props.onRender === 'function' && props.onRender();

        },
        removeSubTree: function (componentWillUnmount) {

            if (!this.___layerAppended___) return;
            var evt = document.createEvent('UIEvents');
            evt.fcuiTarget = this;
            typeof this.props.onBeforeClose === 'function' && this.props.onBeforeClose(evt);
            if (evt.returnValue === false && !componentWillUnmount) return;
            
            ReactDOM.unmountComponentAtNode(this.___layerContainer___);
            this.___layerContainer___.style.left = '-9999px';
            this.___layerContainer___.style.top = '-9999px';
                
            document.body.removeChild(this.___layerContainer___);
            this.___layerAppended___ = false;
            typeof this.props.onClose === 'function' && this.props.onClose();
            this.setState({mouseenter: false});

        },
        render: function () {
            return React.DOM.noscript();
        }
    });

});
