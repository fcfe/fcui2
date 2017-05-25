/**
 * 对话框
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var ReactDOM = require('react-dom');
    var _ = require('underscore');


    var AlertContent = require('./components/dialog/Alert.jsx');
    var ConfirmContent = require('./components/dialog/Confirm.jsx');
    var TitleWindow = require('./TitleWindow.jsx');
    var ShojiScreen = require('./ShojiScreen.jsx');
    var noop = function () {};


    /**
     * @constructor
     * @name Dialog
     */
    function Dialog() {
        this.___tempContainer___ = document.createElement('div');
    }


    /**
     * 弹出窗体
     *
     * @name pop
     * @className Dialog
     * @param {Object} param 弹出配置
     * @param {String} param.popType 弹窗类型，目前支持普通弹窗和侧拉门
     * @param {ReactClass} param.content Dialog内部组件
     * @param {Object} param.contentProps Dialog内部组件初始化时的属性集
     * @param {String} param.className 挂在到Dialog窗体DOM上的class
     * @param {Object} param.style 挂在Dialog窗体DOM上的样式表
     * @param {String} param.skin Dialog皮肤
     * @param {String} param.appSkin Dialog初始化时，传入的系统级皮肤
     * @param {String} param.title Dialog标题栏中显示的标题
     * @param {Object} param.size Dialog窗体的尺寸，与isFullScreen互斥
     * @param {Number} param.size.width Dialog渲染后的宽度
     * @param {Number} param.size.height Dialog渲染后的高度
     * @param {Number} param.zIndex Dialog渲染后的z-index（层次）
     * @param {Boolean} param.isFullScreen Dialog弹出后时候直接全屏显示
     * @param {Boolean} param.showCloseButton 是否显示Dialog标题栏中的关闭按钮
     * @param {Function} param.onBeforeClose 同TitleWindow props.onBeforeClose
     * @param {Function} param.onClose 同TitleWindow props.onClose
     */
    Dialog.prototype.pop = function (param) {
        var me = this;
        var ReactElement;

        if (param.popType === 'shoji') {
            ReactElement = React.createElement(shojiComponentFactory(param, me), {});
        }
        else {
            ReactElement = React.createElement(dialogComponentFactory(param, me), {});
        }

        me.___ui___ = null;
        ReactDOM.render(
            ReactElement,
            me.___tempContainer___,
            function () {
                me.___ui___ = this;
            }
        );
    };


    /**
     * 关闭窗体
     *
     * @name close
     * @className Dialog
     * @attention 此方法直接无条件关闭并销毁窗体，不会触发任何回调函数
     */
    Dialog.prototype.close = function () {
        if (!this.___ui___) return;
        this.___ui___ = null;
        ReactDOM.unmountComponentAtNode(this.___tempContainer___);
    };


    /**
     * 更新content属性集
     *
     * @param {Object} props Dialog content初始化所需要的属性集
     * @name updatePopContentProps
     * @className Dialog
     * @attention 此方法支持刷新param.contentProps的部分属性和新增属性，不支持删除原有属性
     */
    Dialog.prototype.updatePopContentProps = function (props) {
        if (!this.___ui___) return;
        var oldProps = this.___ui___.state.contentProps;
        var newProps = {};
        for (var key in oldProps) {
            if (!oldProps.hasOwnProperty(key)) continue;
            newProps[key] = oldProps[key];
        }
        props = props || {};
        for (var key in props) {
            if (!props.hasOwnProperty(key)) continue;
            newProps[key] = props[key];
        }
        this.___ui___.setState({contentProps: newProps});
    };


    /**
     * 弹出Alert提示框
     *
     * @param {Object} param 对话框属性集
     * @param {String} param.title 提示框标题
     * @param {String} param.message 提示内容
     * @param {Function} param.onClose 关闭后的回调
     * @name alert
     * @className Dialog
     * @attention 此方法内部调用了dialog.pop
     */
    Dialog.prototype.alert = function (param) {
        param = param || {};
        var contentProps ={
            message: param.message,
            labels: param.labels
        };
        var dialogProp = _.extend({}, param, {
            content: AlertContent,
            contentProps: contentProps
        });
        this.pop(dialogProp);
    };


    /**
     * 弹出Confirm确认框
     *
     * @param {Object} param 对话框属性集
     * @param {String} param.title 提示框标题
     * @param {String} param.message 提示内容
     * @param {Function} param.onClose 关闭后的回调
     * @param {Function} param.onEnter 点击确定后的回调
     * @param {Function} param.onCancel 点击取消后的回调
     * @name confirm
     * @className Dialog
     * @attention 此方法内部调用了dialog.pop
     */
    Dialog.prototype.confirm = function (param) {
        param = param || {};
        var contentProps = {
            message: param.message,
            labels: param.labels,
            onEnter:  typeof param.onEnter === 'function' ? param.onEnter : noop,
            onCancel: typeof param.onCancel === 'function' ? param.onCancel : noop
        };
        var dialogProp = _.extend({}, param, {
            content: ConfirmContent,
            contentProps: contentProps
        });
        this.pop(dialogProp);
    };

    /**
     * Shoji Component Factory
     *
     * @param  {Object} param  Dialog配置，见Dialog.pop注释
     * @param  {Object} dialog 弹出此component的dialog实例
     */
    function shojiComponentFactory(param, dialog) {
        return React.createClass({
            // @override
            childContextTypes: {
                appSkin: React.PropTypes.string
            },
            // @override
            getChildContext: function () {
                return {
                    appSkin: typeof param.appSkin === 'string' && param.appSkin ? param.appSkin : ''
                };
            },
            // @override
            getDefaultProps: function () {
                return {};
            },
            // @override
            getInitialState: function () {
                return {
                    isOpen: true,
                    contentProps: param.contentProps || {}
                };
            },
            close: function () {
                this.setState({isOpen: false});
                typeof param.onClose === 'function' && param.onClose();
                dialog.close();
            },
            onAction: function (actionType) {
                if (actionType === 'HideButtonClick') {
                    this.close();
                }
            },
            contentFactory: function () {
                if (typeof param.content !== 'function') {
                    return (<div>No Content</div>);
                }
                var Content = param.content;
                var contentProps = {};
                // 潜克隆一次
                for (var key in this.state.contentProps) {
                    if (!this.state.contentProps.hasOwnProperty(key)) continue;
                    contentProps[key] = this.state.contentProps[key];
                }
                // 挂content窗体回调
                contentProps.close = this.close;
                return (<Content {...contentProps}/>);
            },
            render: function () {
                var ShojiScreenProp = {
                    className: param.className,
                    skin: param.skin,
                    workspaceWidth: param.workspaceWidth,
                    isOpen: this.state.isOpen,
                    showFootBar: false,
                    buttonLabels: {
                        hide: '关闭'
                    },
                    onAction: this.onAction,
                    onBeforeClose: (typeof param.onBeforeClose === 'function') ? param.onBeforeClose : noop,
                    onClose: this.close
                };
                return (
                    <ShojiScreen {...ShojiScreenProp}>
                        {this.contentFactory()}
                    </ShojiScreen>
                );
            }
        });
    }

    /*
     * Dialog Component Factory
     *
     * @param {Object} param Dialog配置，见Dialog.pop注释
     * @param {Object} dialog 弹出此component的dialog实例
     */
    function dialogComponentFactory(param, dialog) {
        return React.createClass({
            // @override
            childContextTypes: {
                appSkin: React.PropTypes.string
            },
            // @override
            getChildContext: function () {
                return {
                    appSkin: typeof param.appSkin === 'string' && param.appSkin ? param.appSkin : ''
                };
            },
            // @override
            getDefaultProps: function () {
                return {};
            },
            // @override
            getInitialState: function () {
                return {
                    isOpen: true,
                    contentProps: param.contentProps || {}
                };
            },
            close: function () {
                this.setState({isOpen: false});
                typeof param.onClose === 'function' && param.onClose();
                dialog.close();
            },
            resize: function () {
                if (this.refs.window && typeof this.refs.window.resize === 'function') {
                    this.refs.window.resize();
                }
                return true;
            },
            contentFactory: function () {
                if (typeof param.content !== 'function') {
                    return (<div>No Content</div>);
                }
                var Content = param.content;
                var contentProps = {};
                // 潜克隆一次
                for (var key in this.state.contentProps) {
                    if (!this.state.contentProps.hasOwnProperty(key)) continue;
                    contentProps[key] = this.state.contentProps[key];
                }
                // 挂content窗体回调
                contentProps.resize = this.resize;
                contentProps.close = this.close;
                return (<Content {...contentProps}/>);
            },
            render: function () {
                var TitleWindowProp = {
                    ref: 'window',
                    className: param.className,
                    style: param.style,
                    skin: param.skin,
                    isOpen: this.state.isOpen,
                    title: param.title,
                    size: param.size,
                    zIndex: param.zIndex,
                    isFullScreen: param.isFullScreen,
                    showCloseButton: param.hasOwnProperty('showCloseButton') ? param.showCloseButton : true,
                    onBeforeClose: (typeof param.onBeforeClose === 'function') ? param.onBeforeClose : noop,
                    onClose: this.close
                };
                return (
                    <TitleWindow {...TitleWindowProp}>
                        {this.contentFactory()}
                    </TitleWindow>
                );
            }
        });
    }


    return Dialog;
});
