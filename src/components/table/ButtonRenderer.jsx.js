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
             * @param {String} buttonIcon 按钮图标
             * @param {String} buttonLabel 按钮文字
             * @param {String} command 按钮命令
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
             * @param {Number} param.row 单元格行号，param1 = 'ButtonRendererClick'
             * @param {Number} param.column 单元格列号，param1 = 'ButtonRendererClick'
             * @param {String} param.command 按钮代表的命令
             */
            this.props.onAction('ButtonRendererClick', {
                item: this.props.item,
                row: this.props.row,
                column: this.props.column,
                command: this.props.command
            });
        },
        render: function () {
            var item = this.props.item;
            var value = this.props.content;
            var tdProp = {
                className: 'td-button ' + this.props.className,
                style: this.props.style,
                title: this.props.title
            };
            var buttonIcon = this.props.buttonIcon;
            var iconProp = {
                className: 'is-icon font-icon' + (typeof buttonIcon === 'string' ? ' ' + buttonIcon : ''),
                style: {
                    float: tdProp.style.textAlign === 'right' ? 'left' : 'right',
                    marginTop: 2
                },
                onClick: this.onIconClick
            };
            var labelProp = {
                className: 'btn-label',
                style: {
                    float: tdProp.style.textAlign === 'right' ? 'left' : 'right'
                },
                onClick: this.onIconClick
            };
            var hideButton = this.props.item['hideButton-' + this.props.field];
            return (
                <td {...tdProp}>
                    {!hideButton ? <div {...iconProp}></div> : null}
                    {this.props.buttonLabel && !hideButton ? <div {...labelProp}>{this.props.buttonLabel}</div> : null}
                    <div style={{
                        margin: '10px 0 5px',
                        lineHeight: '20px'
                    }}>{value}</div>
                </td>
            );
        }
    });
});
