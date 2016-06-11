/**
 * tree 有选择功能的渲染器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var TreeNodeBase = require('../../mixins/TreeNodeBase');
    var tools = require('../../core/treeTools');


    return React.createClass({
        mixins: [TreeNodeBase],
        // @override
        getDefaultProps: function () {
            return {
                index: '',          // 叶子的索引队列
                item: {},           // 叶子对应的数据源
                value: {},          // tree的value
                treeComponent: {},  // tree实例
                disabled: false,    // 禁用
                onAction: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        onOperate: function (e) {
            e.stopPropagation();
            if (this.props.disabled) return;
            var type = this.props.value.display === 'all' ? 'TreeSelectLeaf' : 'TreeUnselectLeaf';
            var param = {
                e: e,
                item: this.props.item,
                index: this.props.index.split(',')
            };
            typeof this.props.onAction === 'function' && this.props.onAction(type, param);
        },
        render: function () {
            var me = this;
            // 该叶子数据源
            var item = me.props.item;
            // 树的展开状态
            var expand = me.props.value.expand || {};
            // 节点所在子树的选择状态
            var select = tools.getNodeSelectInfo(item, me.props.value.selected || {});
            // 显示状态
            var display = me.props.value.display;

            if (display === 'selected' && select.selected === 0) return null;
            var containerProp = {
                ref: 'container',
                className: 'list-normal-item' + (me.props.disabled ? ' list-normal-item-disabled' : ''),
                style: {paddingLeft: (me.props.index.split(',').length - 1) * 12}
            };
            var iconProp = {
                className: 'expand-button font-icon font-icon-caret-' + (expand[item.value] ? 'down' : 'right'),
                style: {visibility: !(item.children instanceof Array) ? 'hidden' : 'auto'},
                onClick: me.onExpand // from TreeNodeBase Mixin
            };
            var selectDisabled = me.props.disabled;
            if (display === 'all') {
                selectDisabled = selectDisabled || (select.selected === select.total && select.total > 0);
            }
            var selectBtnProp = {
                className: 'select-button font-icon'
                    + (selectDisabled ? ' select-button-disabled' : '')
                    + (display === 'all' ? ' font-icon-plus' : ' font-icon-times'),
                onClick: selectDisabled ? undefined : me.onOperate
            };

            return (
                <div {...containerProp}>
                    <div {...selectBtnProp}></div>
                    <div {...iconProp}></div>
                    <span>{item.label}</span>
                </div>
            );
        }
    });

});
