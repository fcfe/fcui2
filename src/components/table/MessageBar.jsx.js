/**
 * table 信息栏渲染器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {

    var React = require('react');

    return React.createClass({
        /**
         * @properties
         * @param {String} message 信息栏显示的内容
         * @param {String} buttonLabel 信息栏按钮的文本，如果为空将不显示此按钮
         * @param {Number} colSpan 信息栏横跨单元格个数
         * @param {Function} onClick 按钮点击回调，即table.props.onAction
         */
        getDefaultProps: function () {
            return {
                message: '',
                buttonLabel: '',
                colSpan: 1,
                onClick: function () {}
            };
        },
        onButtonClick: function (e) {
            /**
             * @fire table onAction
             * @param {String} type TableMessageBarClick: 表头下部信息栏被点击
             */
            this.props.onClick('TableMessageBarClick', {});
        },
        render: function () {
            return (
                <tr className="tr-message">
                    <td colSpan={this.props.colSpan}>
                        <span>{this.props.message}</span>
                        <span onClick={this.onButtonClick} className="link">{this.props.buttonLabel}</span>
                    </td>
                </tr>
            );
        }
    });
});
