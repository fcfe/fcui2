/**
 * tree node base
 */
define(function (require) {


    var React = require('react');


    return {
        onExpand: function (e) {
            if (this.props.disabled) return;
            e.stopPropagation();
            var item = this.props.item;
            // 派发onAction
            if (!item.children.length && typeof this.props.onAction === 'function') {
                var index = this.props.index.split(',');
                index.shift();
                this.props.onAction('TreeLoadChildren', {index: index});
            }
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
        }
    }
});
