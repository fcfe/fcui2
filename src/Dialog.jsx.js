/**
 * @file 对话框
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var ReactDOM = require('react-dom');


    var AlertContent = require('./components/dialog/Alert.jsx');
    var ConfirmContent = require('./components/dialog/Confirm.jsx');
    var TitleWindow = require('./TitleWindow.jsx');
    var noop = function () {};


    /**
     * dialog构造函数
     */
    function Dialog() {
        this.___tempContainer___ = document.createElement('div');
    }


    /**
     * 关闭窗口
     */
    Dialog.prototype.close = function () {
        var me = this;
        var ui = this.___ui___;
        if (!ui) return;
        if (ui.state.isOpen) {
            ui.setState({isOpen: false});
        }
        setTimeout(function () {
            ReactDOM.unmountComponentAtNode(me.___tempContainer___);
            me.___ui___ = null;
        }, 100);
    };


    /**
     * 弹出dialog
     *
     * @param {Object} param dialog配置
     *
     * @param {string} param.className 加载到Dialog根容器的class
     * @param {object} param.style 加载到Dialog根容器的样式
     * @param {string} param.skin Dialog皮肤 
     * @param {string} param.title 标题
     * @param {boolean} param.showCloseButton 关闭按钮开关
     * @param {Function} param.onBeforeClose Dialog关闭前的回调，可以用于阻止窗体关闭
     * @param {Function} param.onClose 关闭后回调
     *
     * @param {Function} param.content dialog的子内容component
     * @param {Object} param.contentProps content初始化时传入的属性集合
     */
    Dialog.prototype.pop = function (param) {
        var me = this;
        var ReactElement = React.createElement(
            dialogComponentFactory(param, me),
            {}
        );
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
     * 更新弹出窗体的content的props，此方法会自动触发resize
     *
     * @param {Object} props dialog content初始化所需要的属性集
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
     * @param {string} param.title 提示框标题
     * @param {string} param.message 提示内容
     * @param {function} param.onClose 关闭后的回调
     */
    Dialog.prototype.alert = function (param) {
        param = param || {};
        var contentProps ={
            message: param.message
        };
        var dialogProp = {
            title: param.title,
            content: AlertContent,
            contentProps: contentProps,
            onClose: param.onClose
        };
        this.pop(dialogProp);
    };


    /**
     * 弹出Confirm确认框
     *
     * @param {Object} param 对话框属性集
     * @param {string} param.title 提示框标题
     * @param {string} param.message 提示内容
     * @param {function} param.onClose 关闭后的回调
     * @param {function} param.onEnter 点击确定后的回调
     * @param {function} param.onCancel 点击取消后的回调
     */
    Dialog.prototype.confirm = function (param) {
        param = param || {};
        var contentProps = {
            message: param.message,
            onEnter:  typeof param.onEnter === 'function' ? param.onEnter : noop,
            onCancel: typeof param.onCancel === 'function' ? param.onCancel : noop
        };
        var dialogProp = {
            content: ConfirmContent,
            contentProps: contentProps,
            title: param.title,
            onClose: param.onClose
        };
        this.pop(dialogProp);
    };


    /**
     * Dialog Component Factory
     *
     * @param {Object} param Dialog配置，见Dialog.pop注释
     * @param {Object} dialog 弹出此component的dialog实例
     */
    function dialogComponentFactory(param, dialog) {
        return React.createClass({
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
                if (this.state.isOpen) {
                    this.setState({isOpen: false});
                    setTimeout(function () {
                        typeof param.onClose === 'function' && param.onClose();
                        dialog.close();
                    }, 100);
                    return;
                }
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
