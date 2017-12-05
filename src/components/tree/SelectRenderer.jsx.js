/**
 * Tree 有选择功能的Item渲染器
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
        /**
         * @fire Tree onAction
         * @param {String} type TreeSelectLeaf：选择树节点；leafRenderer = SelectRenderer
         * @param {Object} param
         * @param {SyntheticEvent} param.e React事件对象；param1 = 'TreeSelectLeaf' || 'TreeUnselectLeaf'
         */
        /**
         * @fire Tree onAction
         * @param {String} type TreeUnselectLeaf：取消选择树节点；leafRenderer = SelectRenderer
         */
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
            var select = tools.getNodeSelectInfo(
                item,
                me.props.value.selected || {},
                this.props.index,
                this.props.treeComponent.___loadingCache___
            );
            // 显示状态
            var display = me.props.value.display;

            if (display === 'selected' && select.selected === 0) return null;
            var containerProp = {
                ref: 'container',
                className: 'list-normal-item' + (me.props.disabled ? ' list-normal-item-disabled' : ''),
                style: {paddingLeft: (me.props.index.split(',').length - 1) * 12}
            };
            var iconProp = {
                className: 'expand-button fcui2-icon fcui2-icon-arrow-' + (expand[item.value] ? 'down' : 'right'),
                style: {visibility: !(item.children instanceof Array) ? 'hidden' : 'visible'},
                onClick: me.onExpand // from TreeNodeBase Mixin
            };
            var selectBtnProp = {};
            if (display === 'all') {
                var disabled = me.props.disabled || (select.selected === select.total && select.total > 0);
                selectBtnProp = {
                    className: 'select-button fcui2-icon '
                        + (disabled ? ' select-button-disabled' : '')
                        + ((select.selected === select.total && select.total > 0)
                            ? ' fcui2-icon-check' : ' fcui2-icon-plus'),
                    onClick: disabled ? undefined : me.onOperate
                };
            }
            else {
                selectBtnProp = {
                    className: 'select-button fcui2-icon fcui2-icon-remove',
                    onClick: me.onOperate
                };
            }
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
