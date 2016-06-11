/**
 * tree node base
 */
define(function (require) {


    var React = require('react');


    return {
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
            // 派发onAction
            if (!item.children.length && typeof this.props.onAction === 'function') {
                this.props.onAction('TreeLoadChildren', {index: this.props.index.split(',')});
            }
        }
    }
});
