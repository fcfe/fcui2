/**
 * @file 带按钮的td
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
