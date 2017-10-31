/**
 * Table 普通单元格渲染器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {
    var React = require('react');
    return React.createClass({
        /**
         * @properties
         * @param {String} className 加在单元格td上的类
         * @param {String} style 加在单元格td上的样式表
         * @param {String} title td鼠标悬浮上的提示
         * @param {String} content 单元格中显示的内容
         */
        getDefaultProps: function getDefaultProps() {
            return {
                className: '',
                content: '',
                style: {}
            };
        },
        getInitialState: function getInitialState() {
            return {};
        },
        render: function render() {
            var tdProp = {
                className: 'td-button ' + this.props.className,
                style: this.props.style,
                title: this.props.title
            };
            return React.createElement(
                'td',
                tdProp,
                React.createElement(
                    'div',
                    { style: {
                            margin: '5px 0',
                            lineHeight: '20px'
                        } },
                    this.props.content
                )
            );
        }
    });
});