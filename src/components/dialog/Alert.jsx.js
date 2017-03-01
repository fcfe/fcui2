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
        contextTypes: {
            appSkin: React.PropTypes.string
        },
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
            var className = 'fcui2-dialog-'
                + (this.context.appSkin ? this.context.appSkin + '-alert' : 'alert');
            var buttonProps = {
                skin: 'important',
                width: 67,
                label: '确定',
                onClick: this.onClose
            };
            return (
                <div className={className}>
                    <div
                        className="message"
                        dangerouslySetInnerHTML={{__html: this.props.message}}
                    >
                    </div>
                    <div className="button-bar">
                        <Button {...buttonProps}/>
                    </div>
                </div>
            );
        }
    });


});
