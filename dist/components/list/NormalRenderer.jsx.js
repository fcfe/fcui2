/**
 * List Item默认渲染器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {

    var React = require('react');

    return React.createClass({
        /**
         * @properties
         * @param {String} label item上显示的内容
         * @param {String} value item代表的值 
         * @param {Boolean} disabled item是否处于禁用状态
         * @param {Function} onClick 点击后的回调
         * @attention <ListItemObject>中所有数据型属性（即不包含方法）都会传入List Item props，但disabled和onClick会被覆盖
         */
        // @override
        getDefaultProps: function getDefaultProps() {
            return {
                label: '',
                value: '',
                disabled: false,
                onClick: function onClick() {}
            };
        },
        // @override
        getInitialState: function getInitialState() {
            return {};
        },
        /**
         * @fire List onClick
         * @param {SyntheticEvent} e React事件对象
         * @param {HtmlElement} e.target List Item的根容器
         * @param {String} e.target.value 对应ListItemObject.value
         */
        onClick: function onClick(e) {
            if (this.props.disabled) return;
            e = { target: this.refs.container };
            e.target.value = this.props.value;
            this.props.onClick(e);
        },
        render: function render() {
            var containerProp = {
                ref: 'container',
                className: 'list-normal-item' + (this.props.disabled ? ' list-normal-item-disabled' : ''),
                onClick: this.onClick
            };
            return React.createElement(
                'div',
                containerProp,
                React.createElement(
                    'span',
                    null,
                    this.props.label
                )
            );
        }
    });
});