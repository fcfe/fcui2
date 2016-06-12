/**
 * tree组件item默认渲染器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var TreeNodeBase = require('../../mixins/TreeNodeBase');


    return React.createClass({
        mixins: [TreeNodeBase],
        // @override
        getDefaultProps: function () {
            return {
                index: '',
                item: {},
                value: {},
                treeComponent: {},
                disabled: false, // 禁用
                onAction: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        onClick: function (e) {
            if (this.props.disabled) return;
            typeof this.props.onAction === 'function' && this.props.onAction('TreeLeafClick', {
                item: this.props.item,
                index: this.props.index
            });
        },
        render: function () {
            var item = this.props.item;
            var expand = this.props.value.expand || {};
            var containerProp = {
                ref: 'container',
                className: 'list-normal-item' + (this.props.disabled ? ' list-normal-item-disabled' : ''),
                onClick: this.onClick,
                style: {paddingLeft: (this.props.index.split(',').length - 1) * 12}
            };
            var iconProp = {
                className: 'expand-button font-icon font-icon-caret-' + (expand[item.value] ? 'down' : 'right'),
                style: {visibility: !(item.children instanceof Array) ? 'hidden' : 'auto'},
                onClick: this.onExpand // from TreeNodeBase Mixin
            };
            return (
                <div {...containerProp}>
                    <div {...iconProp}></div>
                    <span>{item.label}</span>
                </div>
            );
        }
    });

});
