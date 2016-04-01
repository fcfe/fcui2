/**
 * @file 对话框
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var ReactDOM = require('react-dom');
    var PopWindow = require('./components/dialog/PopWindow.jsx');
    var AlertContent = require('./components/dialog/Alert.jsx');
    var ConfirmContent = require('./components/dialog/Confirm.jsx');


    /**
     * dialog构造函数
     */
    function Dialog() {
        this.container = document.createElement('div');
        this.workspace = document.createElement('div');
        this.background = document.createElement('div');
        this.container.className = 'fcui2-dialog-container';
        this.workspace.className = 'fcui2-dialog-workspace';
        this.background.className = 'fcui2-dialog-background';
        this.container.appendChild(this.background);
        this.container.appendChild(this.workspace);
        this.ui = null;
    }


    /**
     * 弹出dialog
     *
     * @param {Object} param dialog配置，直接导成PopWindow的属性集合
     * @param {Function} param.content dialog的子内容
     * @param {Object} param.contentProps content初始化时传入的属性集合
     * @param {string} param.title 标题
     * @param {Function} param.onBeforeClose 调用close方法时，关闭前回调，可以用于阻止窗体关闭
     * @param {Function} param.onClose 关闭后回调
     */
    Dialog.prototype.pop = function (param) {

        var me = this;
        var doc = document.documentElement;
        var workspace = this.workspace;

        // dialog不应该撑破window，初始化时应在可视区域意外，并尺寸应该足够大，方便计算content尺寸
        workspace.style.maxWidth = doc.clientWidth + 'px';
        workspace.style.maxHeight = doc.clientHeight + 'px';
        workspace.style.left = workspace.style.top = '-9999px';
        workspace.style.width = workspace.style.height = '9999px';
        document.body.appendChild(me.container);

        // 记录关闭事件
        var beforeCloseHandler = typeof param.onBeforeClose === 'function' ? param.onBeforeClose : function () {};
        var closeHandler = typeof param.onClose === 'function' ? param.onClose : function () {};
        
        // 浅克隆，赋新值
        var windowProps = {};
        for (var key in param) {
            if (param.hasOwnProperty(key)) windowProps[key] = param[key];
        }
        windowProps.___dialogContainer___ = workspace;

        // 关闭销毁闭包
        windowProps.onDispose = function () {
            me.dispose();
        };
        windowProps.onClose = function (evt) {
            beforeCloseHandler(evt);
            if (evt.returnValue === false) return;
            me.dispose();
            closeHandler();
        };

        // 弹出
        me.ui = ReactDOM.render(React.createElement(PopWindow, windowProps), me.workspace, loaded);

        // 设置焦点
        function loaded() {
            var timer = setInterval(function () {
                if (!me.ui) return;
                clearInterval(timer);
                // 设置输入焦点，如果指定了。
                if (
                    param.focus
                    && me.ui.content
                    && me.ui.content.refs.hasOwnProperty(param.focus)
                    && typeof me.ui.content.refs[param.focus].focus === 'function'
                ) {
                    me.ui.content.refs[param.focus].focus();
                } 
            }, 10);
        }
    };


    /**
     * 销毁窗体
     */
    Dialog.prototype.dispose = function () {
        ReactDOM.unmountComponentAtNode(this.workspace);
        document.body.removeChild(this.container);
        this.ui = null;
    };


    /**
     * 更新弹出窗体的content的props，此方法会自动触发resize
     *
     * @param {Object} props dialog content初始化所需要的属性集
     */
    Dialog.prototype.updatePopContentProps = function (props) {
        if (!this.ui) return;
        this.ui.updateContentProps(props);
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
        // 做一层参数封装和下钻
        var dialogProp = {
            title: param.title,
            content: AlertContent,
            contentProps: param,
            onClose: param.onClose
        };
        delete param.title;
        delete param.onClose;
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
        param.onEnter = typeof param.onEnter === 'function' ? param.onEnter : function () {};
        param.onCancel = typeof param.onCancel === 'function' ? param.onCancel : function () {};
        var dialogProp = {
            content: ConfirmContent,
            contentProps: param,
            title: param.title,
            onClose: param.onClose
        };
        delete param.title;
        delete param.onClose;
        this.pop(dialogProp);
    };


    return Dialog;
});
