/**
 * 树节点基础mixin
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');


    return {
        /**
         * 展开节点，通知Tree展开某个节点
         * @interface onExpand
         * @param {SyntheticEvent} e React事件对象
         */
        onExpand: function (e) {
            e.stopPropagation();
            if (this.props.disabled) return;
            var item = this.props.item;
            // 派发onChange
            var value = JSON.parse(JSON.stringify(this.props.value));
            value.expand = value.expand || {};
            if (!value.expand[item.value]) {
                value.expand[item.value] = true;
            }
            else {
                delete value.expand[item.value];
            }
            e.target = this.refs.container;
            e.target.value = JSON.stringify(value);
            this.props.treeComponent.___dispatchChange___(e);
            /**
             * @fire Tree onAction
             * @param {String} type TreeLoadChildren：加载子树
             * @param {Object} param 回调参数
             * @param {Array.<String>} param.index 叶子序列
             */
            if (!item.children.length && typeof this.props.onAction === 'function') {
                this.props.onAction('TreeLoadChildren', {index: this.props.index.split(',')});
            }
        }
    }
});
