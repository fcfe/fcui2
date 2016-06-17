/**
 *  带按钮的td
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {

    var React = require('react');

    return React.createClass({
        getDefaultProps: function () {
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
             * @param {String} type ButtonRendererClick: 单元格内的icon被点击
             * @param {Object} param 控制参数对象
             * @param {Object} param.item 单元格所在行数据源，ButtonRendererClick时此属性存在
             * @param {Object} param.row 单元格行号，ButtonRendererClick时此属性存在
             * @param {Object} param.column 单元格列号，ButtonRendererClick时此属性存在
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
