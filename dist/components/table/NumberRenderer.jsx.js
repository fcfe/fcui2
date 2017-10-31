/**
 * Table 数值型单元格渲染器
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
         * @param {String} content 单元格中显示的内容
         * @param {String} renderType 数字显示类型：
         *     int：整形
         *   float：浮点
         * percent：百分比
         * @param {Number} fixed 显示保留的小数位数，renderType = 'int' 时无效
         */
        getDefaultProps: function getDefaultProps() {
            return {
                className: '',
                style: {},
                content: '',
                renderType: 'int',
                fixed: 2
            };
        },
        getInitialState: function getInitialState() {
            return {};
        },
        render: function render() {
            var tdProp = {
                className: 'td-number ' + this.props.className,
                style: this.props.style
            };
            var value = this.props.content;
            if (isNaN(value)) {
                value = '-';
            } else {
                value = value * 1;
                switch (this.props.renderType) {
                    case 'int':
                        value = parseInt(value, 10);
                        break;
                    case 'float':
                        value = value.toFixed(isNaN(this.props.fixed) ? 2 : parseInt(this.props.fixed, 10));
                        break;
                    case 'percent':
                        value = (value * 100).toFixed(2) + '%';
                        break;
                    default:

                }
            }
            return React.createElement(
                'td',
                tdProp,
                value
            );
        }
    });
});