/**
 * Dialog Alert渲染器
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var Button = require('../../Button.jsx');
    var React = require('react');


    return React.createClass({
        /**
         * @properties
         * @param {String} message 显示在主区域的内容
         * @param {Function} onClick 通知外部关闭的回调
         */
        getDefaultProps : function () {
            return {
                message: 'Message',
                close: function () {}
            };
        },
        onClose: function () {
            this.props.close();
        },
        render: function () {
            return (
                <div className="fcui2-dialog-alert">
                    <div className="message">{this.props.message}</div>
                    <div className="button-bar">
                        <Button skin="important" label="确定" onClick={this.onClose}/>
                    </div>
                </div>
            );
        }
    });


});
