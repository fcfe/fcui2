/**
 * 信息框
 * @author chenxiao
 * @email chenxiao09@baidu.com
 * @version 0.0.2.1
 */

define(function (require) {
    var React = require('react');
    var Button = require('./Button.jsx');
    var cTools = require('./core/componentTools');
    var language = require('./core/language').message;
    var messageType = {
        LOADING: 'loading',
        REFRESH: 'refresh',
        NEW_REFRESH: 'new-refresh',
        SUCCESS: 'success',
        FAIL: 'fail'
    };

    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {string} status 当前的状态,默认有5种状态值:loading, refresh, new-refresh, success, fail
         * @param {string} icon 展示的icon,可自定义图标样式
         * @param {String} message 展示的信息文本
         * @param {boolean} autoHide 是否自动消失，默认false
         * @param {Number} autoHideTime 自动隐藏时间容迟，单位：毫秒，仅在autoHide为true时有效
         * @param {Function} onRefreshClick 刷新，重新加载的回调函数
         */
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                status: messageType.LOADING,
                icon: '',
                message: '',
                autoHide: false,
                autoHideTime: 0,
                onRefreshClick: cTools.noop
            };
        },

        // @override
        getInitialState: function () {
            return {};
        },

        onRefreshClick: function () {
            typeof this.props.onRefreshClick === 'function' && this.props.onRefreshClick();
        },

        componentDidMount: function () {
            var autoHideTime = this.props.autoHideTime;
            var me = this;
            if (autoHideTime) {
                setTimeout(function () {
                    me.refs.container.remove();
                }, autoHideTime);
            }
        },

        render: function () {
            var props = this.props;
            var {status, autoHide, autoHideTime} = props;
            if (autoHide && !autoHideTime) {
                return null;
            }
            var containerProp = cTools.containerBaseProps('message', this, {
                onClick: status === messageType.REFRESH ? this.onRefreshClick : undefined
            });
            var refreshButtonProp = {
                label: '重新加载',
                onClick: status === messageType.NEW_REFRESH ? this.onRefreshClick : undefined
            };
            return (
                <div {...containerProp}>
                    <span className={status + '-icon ' + this.props.icon}></span>
                    <span className={status + '-text'}>
                        {props.message ? props.message : (language.hasOwnProperty(status) ? language[status] : null)}
                        {status === messageType.NEW_REFRESH
                            ? <Button {...refreshButtonProp} />
                            : null
                        }
                    </span>
                </div>
            );
        }
    });
});
