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
                layerPosition: '',
                onBeforeOpen: noop,
                onAfterOpen: noop,
                onBeforeClose: noop,
                onAfterClose: noop
            };
        },
        // @override
        componentDidMount: function () {
            if (!window || !document) return;
            this.___layerContainer___ = document.createElement('div');
            this.___layerContainer___.className = 'fcui2-layer';
            this.___layerContainer___.style.left = '-9999px';
            this.___layerContainer___.style.top = '-9999px';
            this.___layerAppended___ = false;
            this.renderSubTree(this.props);
        },
        // @override
        componentWillReceiveProps: function(newProps) {
            this.renderSubTree(newProps);
        },
        // @override
        componentWillUnmount: function() {
            this.removeSubTree();
        },
        renderSubTree: function (props) {
            if (!this.___layerContainer___ || !props.anchor) return;
            if (props.isOpen && this.___layerAppended___) return;
            if (!props.isOpen && !this.___layerAppended___) return;
            // open
            var me = this;
            if (props.isOpen) {
                document.body.appendChild(this.___layerContainer___);
                this.___layerAppended___ = true;
                typeof props.onBeforeOpen === 'function' && props.onBeforeOpen();
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
            typeof props.onAfterOpen === 'function' && props.onAfterOpen();
        },
        removeSubTree: function () {
            typeof this.props.onBeforeClose === 'function' && this.props.onBeforeClose();
            ReactDOM.unmountComponentAtNode(this.___layerContainer___);
            this.___layerContainer___.style.left = '-9999px';
            this.___layerContainer___.style.top = '-9999px';
            this.___layerAppended___ = false;
            document.body.removeChild(this.___layerContainer___);
            typeof this.props.onAfterClose === 'function' && this.props.onAfterClose();
        },
        render: function () {
            return React.DOM.noscript();
        }
    });

});
