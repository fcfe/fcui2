/**
 * Table 带icon按钮的单元格渲染器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {

    var React = require('react');

    return React.createClass({
        getDefaultProps: function () {
            /**
             * @properties
             * @param {String} className 加在单元格td上的类
             * @param {Object} style 加在单元格td上的样式表
             * @param {Number} row 单元格行索引
             * @param {Number} column 单元格列索引
             * @param {Function} onAction 表格回调总线
             * @attention 对于所有单元格渲染器，传入的props格式是一致的，具体见src\core\tableTools.js
             */
            return {
                className: '',
                style: {},
                item: {},
                row: -1,
                column: -1,
                onAction: function () {}
            };
        },
        onIconClick: function (e) {
            /**
             * @fire table onAction
             * @param {String} type ButtonRendererClick: 单元格内的icon被点击；<TableFieldObject>.renderer = ButtonRenderer
             * @param {Object} param
             * @param {Object} param.item 单元格所在行数据源，param1 = 'ButtonRendererClick'
             * @param {Object} param.row 单元格行号，param1 = 'ButtonRendererClick'
             * @param {Object} param.column 单元格列号，param1 = 'ButtonRendererClick'
             */
            this.props.onAction('ButtonRendererClick', {
                item: this.props.item,
                row: this.props.row,
                column: this.props.column
            });
        },
        render: function () {
            var item = this.props.item;
            var value = this.props.content;
            var tdProp = {
                className: 'td-button ' + this.props.className,
                style: this.props.style
            };
            var btnProp = {
                className: 'font-icon'
                    + (typeof this.props.buttonIcon === 'string' ? ' ' + this.props.buttonIcon : ''),
                style: {
                    float: tdProp.style.textAlign === 'right' ? 'left' : 'right'
                },
                onClick: this.onIconClick
            };
            return (
                <td {...tdProp}>
                    {value}
                    <div {...btnProp}></div>
                </td>
            );
        }
    });
});
