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
            try {
                var contentProps = props || {};
                // content调用dispose直接销毁窗口，不触发任何事件
                contentProps.dispose = function () {
                    me.props.dispose();
                };
                // content调用close会相继触发onBeforeClose、onClose
                contentProps.close = function () {
                    me.close();
                };
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
            var dom = this.refs.container.parentNode;
            var doc = document.documentElement;
            var content = this.refs.content;
            dom.style.height = (content.scrollHeight + 50)+ 'px';
            dom.style.width = (content.scrollWidth + 20) + 'px';
            dom.style.left = 0.5 * (doc.clientWidth - dom.clientWidth) + 'px';
            dom.style.top = 0.38 * (doc.clientHeight - dom.clientHeight) + 'px';
        },
        render: function () {
            return (
                <div ref="container">
                    <div className="title-bar">
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
        this.background = document.createElement('div');
        this.container.className = 'fcui2-dialog';
        this.background.className = 'fcui2-dialog-background';
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

        me.container.style.maxWidth = doc.clientWidth + 'px';
        me.container.style.maxHeight = doc.clientHeight + 'px';
        document.body.appendChild(me.background);
        document.body.appendChild(me.container);
        document.body.style.overflow = 'hidden';

        param = param || {};
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

        me.ui = ReactDOM.render(React.createElement(popWindow, param), me.container, loaded);

        function loaded() {
            var timer = setInterval(function () {
                if (!me.ui) return;
                clearInterval(timer);
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
     * 更新弹出窗体的content的props 
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
        ReactDOM.unmountComponentAtNode(this.container);
        document.body.removeChild(this.container);
        document.body.removeChild(this.background);
        document.body.style.overflow = '';
        this.container.style.height = '10px';
        this.container.style.width = '10px';
        this.ui = null;
    };


    return Dialog;
});
