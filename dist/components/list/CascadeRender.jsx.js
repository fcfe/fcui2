/**
 * Cascade Item默认级联菜单渲染器
 * @author Chen Xiao (chenxiao09@baidu.com)
 */
define(function (require) {
    var React = require('react');
    var cTools = require('../../core/componentTools');
    var List = require('../../List.jsx');

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
                // base
                className: '',
                style: {},
                disabled: false,
                // self
                children: [],
                onClick: cTools.noop
            };
        },
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
            if (this.props.disabled || this.props.children && this.props.children.length) return;
            e = { target: this.refs.listItem };
            e.target.value = this.props.value;
            this.props.onClick(e);
        },
        onListClick: function onListClick(e) {
            this.props.onClick(e);
        },
        render: function render() {
            var hasChildren = this.props.children && this.props.children.length;
            var itemProp = {
                ref: 'listItem',
                className: 'list-normal-item' + (this.props.disabled ? ' list-normal-item-disabled' : ''),
                onClick: this.onClick,
                onMouseLeave: this.onMouseLeave
            };
            if (hasChildren) {
                itemProp.onMouseEnter = this.onMouseEnter;
            }
            var listProp = {
                datasource: this.props.children,
                onClick: this.onListClick,
                style: {
                    maxHeight: '242px',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }
            };
            return React.createElement(
                'div',
                itemProp,
                this.props.children && this.props.children.length ? React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        null,
                        this.props.label
                    ),
                    React.createElement('div', { className: 'icon-right fcui2-icon fcui2-icon-arrow-right' }),
                    React.createElement(
                        'div',
                        { className: 'children-container' },
                        React.createElement(List, listProp)
                    )
                ) : React.createElement(
                    'span',
                    null,
                    this.props.label
                )
            );
        }
    });
});