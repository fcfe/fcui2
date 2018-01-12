/**
 * 信息框
 * @author chenxiao
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
        contextTypes: {
            appSkin: React.PropTypes.string
        },
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {string} status 当前的状态,默认有5种状态值:loading, refresh, new-refresh, success, fail
         * @param {string} icon 展示的icon,可自定义图标样式
         * @param {String} message 展示的信息文本，如果不设置，根据status显示默认的文本
         * @param {boolean} autoHide 是否自动消失，默认false
         * @param {Number} autoHideTime 自动隐藏时间容迟，单位：毫秒，仅在autoHide为true时有效
         * @param {Object} buttonProps 被无条件灌入到内部按钮的属性集
         * @param {Function} onRefreshClick 刷新，重新加载的回调函数
         * @param {Function} onIconClick 
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
                buttonProps: {},
                onRefreshClick: cTools.noop,
                onIconClick: cTools.noop
            };
        },

        // @override
        getInitialState: function () {
            return {};
        },

        onRefreshClick: function () {
            typeof this.props.onRefreshClick === 'function' && this.props.onRefreshClick();
        },

        onIconClick: function () {
            typeof this.props.onIconClick === 'function' && this.props.onIconClick();
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
            var text = props.message ? props.message : (language.hasOwnProperty(status) ? language[status] : '');
            return (
                <div {...containerProp}>
                    <span className={status + '-icon ' + this.props.icon} onClick={this.onIconClick}></span>
                    <span className={status + '-text'} dangerouslySetInnerHTML={{__html: text}}></span>
                    {status === messageType.NEW_REFRESH ? <Button {...refreshButtonProp} {...this.props.buttonProps}/> : null}
                </div>
            );
        }
    });
});
