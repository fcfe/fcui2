/**
 * table 普通单元格渲染器
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
         */
        getDefaultProps: function () {
            return {
                className: '',
                content: '',
                style: {},
            };
        },
        getInitialState: function () {
            return {};
        },
        render: function () {
            var tdProp = {
                className: 'td-button ' + this.props.className,
                style: this.props.style
            };
            return (
                <td {...tdProp}>{this.props.content}</td>
            );
        }
    });
});
