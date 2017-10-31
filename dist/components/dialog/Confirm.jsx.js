/**
 * Dialog Confirm渲染器
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
         * @param {String} message 主区域显示的内容
         * @param {Function} onEnter 点击确定的回调
         * @param {Function} onCancel 点击取消的回调
         */
        contextTypes: {
            appSkin: React.PropTypes.string
        },
        getDefaultProps: function getDefaultProps() {
            return {
                message: 'Message',
                labels: {
                    enter: '确定',
                    cancel: '取消'
                },
                onEnter: null,
                onCancel: null
            };
        },
        onEnterClick: function onEnterClick() {
            typeof this.props.onEnter === 'function' && this.props.onEnter();
            this.props.close();
        },
        onCancelClick: function onCancelClick() {
            typeof this.props.onCancel === 'function' && this.props.onCancel();
            this.props.close();
        },
        render: function render() {
            var className = 'fcui2-dialog-' + (this.context.appSkin ? this.context.appSkin + '-alert' : 'alert');
            var enterProps = {
                skin: 'important',
                label: this.props.labels.enter,
                width: this.props.labels.enter.length < 4 ? 67 : undefined,
                onClick: this.onEnterClick
            };
            var cancelProps = {
                skin: this.context.appSkin ? 'grey1' : '',
                label: this.props.labels.cancel,
                width: 67,
                onClick: this.onCancelClick
            };
            return React.createElement(
                'div',
                { className: className },
                React.createElement('div', { className: 'message', dangerouslySetInnerHTML: { __html: this.props.message } }),
                React.createElement(
                    'div',
                    { className: 'button-bar' },
                    React.createElement(Button, enterProps),
                    React.createElement(Button, cancelProps)
                )
            );
        }
    });
});