/**
 * @file 带选择状态的List渲染器
 * @author mahaina (mahaina@baidu.com)
 * @date 2016/11/16.
 */
define(function (require) {


    const React = require('react');


    return React.createClass({
        /**
         * @properties
         * @param {String} label item上显示的内容
         * @param {String} value item代表的值
         * @param {Boolean} disabled item是否处于禁用状态
         * @param {String} isSelected 选中设置方法一：当前项是否被选中
         * @param {Function} onClick 点击后的回调
         * @attention <ListItemObject>中所有数据型属性（即不包含方法）都会传入List Item props，但disabled和onClick会被覆盖
         */
        // @override
        getDefaultProps: function () {
            return {
                label: '',
                value: '',
                disabled: false,
                isSelected: false,
                onClick: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        /**
         * @fire List onClick
         * @param {SyntheticEvent} e React事件对象
         * @param {HtmlElement} e.target List Item的根容器
         * @param {String} e.target.value 对应ListItemObject.value
         */
        onClick: function (e) {
            if (this.props.disabled) return;
            e = {target: this.refs.container};
            e.target.value = this.props.value;
            this.props.onClick(e);
        },
        render: function () {
            const {disabled, label, isSelected} = this.props;
            const classNames = [
                'list-normal-item',
                disabled ? 'list-normal-item-disabled' : '',
                isSelected === true ? 'list-normal-item-selected' : ''
            ];
            const containerProp = {
                ref: 'container',
                className: classNames.join(' '),
                onClick: this.onClick
            };
            return (
                <div {...containerProp}>
                    <span>{label}</span>
                </div>
            );
        }
    });

});
