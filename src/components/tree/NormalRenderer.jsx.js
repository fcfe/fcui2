/**
 * tree item默认渲染器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var TreeNodeBase = require('../../mixins/TreeNodeBase');


    return React.createClass({
        mixins: [TreeNodeBase],
        // @override
        /**
         * @properties
         * @param {String} index 叶子序列，通过此序列，可以从datasource中依次访问找到叶子的数据源
         * @param {Object} item 叶子对应的数据源
         * @param {ReactComponent} treeComponent 叶子所在树的实例
         * @param {Boolean} disabled 叶子是否在禁用状态
         * @param {Function} onAction 回调接口
         */
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
            /**
             * @fire Tree onAction
             * @param {String} type TreeLeafClick：树节点被点击；leafRenderer = NormalRenderer
             * @param {Object} param
             * @param {Object} param.item 叶子对应的数据源；param1 = 'TreeLeafClick'
             * @param {Array.<String>} param.index 叶子序列
             */
            typeof this.props.onAction === 'function' && this.props.onAction('TreeLeafClick', {
                item: this.props.item,
                index: this.props.index.split(',')
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
