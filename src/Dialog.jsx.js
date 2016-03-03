define(function (require) {


    var Button = require('./Button.jsx');
    var React = require('react');
    var ReactDOM = require('react-dom');


    // 窗口，包含title bar 和content container
    var popWindow = React.createClass({
        // @override
        getDefaultProps : function () {
            return {
                title: 'PopWindowTitle',
                close: function () {},
                dispose: function () {}
            };
        },
        // @override 启动后装载content
        componentDidMount: function () {
            var me = this;
            if (typeof me.props.content === 'function') {
                me.updateContentProps(me.props.contentProps);
            }
            else {
                me.resize();
            }
        },
        updateContentProps: function (props) {
            var me = this;
            var contentProps = props || {};
            // content调用dispose直接销毁窗口，不触发任何事件
            contentProps.dispose = function () {
                me.props.dispose();
            };
            // content调用close会相继触发onBeforeClose、onClose
            contentProps.close = function () {
                me.close();
            };
            // content调用resize会触发dialog重新计算尺寸和位置，一般在componentDidUpdate中使用
            contentProps.resize = function () {
                me.resize();
            };
            try {
                me.content = ReactDOM.render(
                    React.createElement(me.props.content, contentProps),
                    me.refs.content,
                    function () {me.resize();}
                );
            }
            catch (e) {
                console.error('Fail to load dialog content.');
                me.resize();
            }
        },
        // 点击Title Bar的关闭会触发，content内部调用props.close也会触发
        close: function () {
            var evt = document.createEvent('UIEvents');
            evt.fcuiTarget = this;
            this.props.close(evt);
        },
        resize: function () {
            var doc = document.documentElement;
            var container = this.props.dialogContainer;
            var title = this.refs.title;
            var content = this.refs.content;
            var width = 0;
            var height = 0;
            // 将窗体移出可视区并让content充分展开
            content.className = 'content';
            container.style.left = container.style.top = '-9999px';
            container.style.width = container.style.height = '9999px;'
            // 获取content尺寸并判断是否需要纵向滚动条
            width = content.offsetWidth;
            height = content.offsetHeight + title.offsetHeight;
            if (height > doc.clientHeight) width += 20;
            // 设置尺寸并移入可视区
            container.style.width = width + 'px';
            container.style.height = height + 'px';
            container.style.left = 0.5 * (doc.clientWidth - container.clientWidth) + 'px';
            container.style.top = 0.38 * (doc.clientHeight - container.clientHeight) + 'px';
            content.className = 'content content-fixed';
        },
        render: function () {
            return (
                <div ref="container">
                    <div className="title-bar" ref="title">
                        <span>{this.props.title}</span>
                        <div className="font-icon font-icon-times" onClick={this.close}></div>
                    </div>
                    <div ref="content" className="content"></div>
                </div>
            );
        }
    });


    // alert内容，这是一个内置的subApp
    var alert = React.createClass({
        getDefaultProps : function () {
            return {
                icon: 'font-icon-hint-exclamation-s',
                iconColor: '#FBBC05',
                message: 'Message'
            };
        },
        render: function () {
            var icon = 'message-icon font-icon ' + this.props.icon
            return (
                <div className="fcui2-dialog-alert">
                    <div className={icon} style={{color: this.props.iconColor}}></div>
                    <div className="message">{this.props.message}</div>
                    <div className="button-bar">
                        <Button skin="important" label="确定" onClick={this.props.close}/>
                    </div>
                </div>
            );
        }
    });


    // confirm内容
    var confirm = React.createClass({
        getDefaultProps : function () {
            return {
                icon: 'font-icon-hint-exclamation-s',
                iconColor: '#FBBC05',
                message: 'Message',
                onEnter: function () {},
                onCancel: function () {}
            };
        },
        enterHandler: function () {
            this.props.onEnter();
            this.props.dispose();
        },
        cancelHandler: function () {
            this.props.onCancel();
            this.props.dispose();
        },
        render: function () {
            var icon = 'message-icon font-icon ' + this.props.icon;
            return (
                <div className="fcui2-dialog-alert">
                    <div className={icon} style={{color: this.props.iconColor}}></div>
                    <div className="message">{this.props.message}</div> 
                    <div className="button-bar">
                        <Button skin="important" label="确定" onClick={this.enterHandler}/>
                        <Button label="取消" onClick={this.cancelHandler}/>
                    </div>
                </div>
            );
        }
    });


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
     * @param {Object} param dialog配置，直接导成popWindow的属性集合
     * @param {Function} param.content dialog的子内容
     * @param {Object} param.contentProps content初始化时传入的属性集合
     * @param {?string} param.title 标题
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
        // document.body.style.overflow = 'hidden';

        // dialog的props
        param = param || {};
        param.dialogContainer = workspace;
        param.onBeforeClose = typeof param.onBeforeClose === 'function' ? param.onBeforeClose : function () {};
        param.onClose = typeof param.onClose === 'function' ? param.onClose : function () {};
        param.dispose = function () {
            me.dispose();
        };
        param.close = function (evt) {
            param.onBeforeClose(evt);
            if (evt.returnValue === false) return;
            param.dispose();
            param.onClose();
        };

        // 弹出
        me.ui = ReactDOM.render(React.createElement(popWindow, param), me.workspace, loaded);

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
     * 更新弹出窗体的content的props，此方法会自动触发resize
     */
    Dialog.prototype.updatePopContentProps = function (props) {
        if (!me.ui) return;
        me.ui.updateContentProps(props);
    };


    /**
     * 弹出Alert提示框
     */
    Dialog.prototype.alert = function (param) {
        param = param || {};
        // 做一层参数封装和下钻
        var dialogProp = {
            title: param.title,
            content: alert,
            contentProps: param,
            onClose: param.onClose
        };
        delete param.title;
        delete param.onClose;
        this.pop(dialogProp);
    };


    /**
     * 弹出Confirm确认框
     */
    Dialog.prototype.confirm = function (param) {
        param = param || {};
        param.onEnter = typeof param.onEnter === 'function' ? param.onEnter : function () {};
        param.onCancel = typeof param.onCancel === 'function' ? param.onCancel : function () {};
        var dialogProp = {
            content: confirm,
            contentProps: param,
            title: param.title,
            onClose: param.onClose
        };
        delete param.title;
        delete param.onClose;
        this.pop(dialogProp);
    };


    /**
     * 销毁窗体
     */
    Dialog.prototype.dispose = function () {
        ReactDOM.unmountComponentAtNode(this.workspace);
        document.body.removeChild(this.container);
        // document.body.style.overflow = '';
        this.ui = null;
    };


    return Dialog;
});
