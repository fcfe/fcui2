define(function (require) {


    var Button = require('./Button.jsx');


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
                try {
                    var contentProps = me.props.contentProps || {};
                    // content调用dispose直接销毁窗口，不触发任何事件
                    contentProps.dispose = function () {
                        me.props.dispose();
                    };
                    // content调用close会相继触发onBeforeClose、onClose
                    contentProps.close = function () {
                        me.closeHandler();
                    };
                    me.content = React.render(
                        React.createElement(me.props.content, contentProps),
                        me.refs.content.getDOMNode(),
                        function () {me.resize();}
                    );
                }
                catch (e) {
                    console.error('Fail to load dialog content.');
                    me.resize();
                }
            }
            else {
                me.resize();
            }
        },
        // 点击Title Bar的关闭会触发，content内部调用props.close也会触发
        closeHandler: function () {
            var evt = document.createEvent('UIEvents');
            evt.fcuiTarget = this;
            this.props.close(evt);
        },
        resize: function () {
            var dom = this.getDOMNode().parentNode;
            var doc = document.documentElement;
            var left = 0.5 * (doc.clientWidth - dom.clientWidth);
            var top = 0.38 * (doc.clientHeight - dom.clientHeight);
            top = top < 0 ? 0 : top;
            dom.style.cssText = 'left:' + left + 'px;top:' + top + 'px';
        },
        render: function () {
            return (
                <div>
                    <div className="title-bar">
                        <span>{this.props.title}</span>
                        <div className="font-icon font-icon-times" onClick={this.closeHandler}></div>
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
                icon: 'font-icon-warning',
                iconColor: '#FBBC05',
                message: 'Message'
            };
        },
        render: function () {
            var icon = 'font-icon ' + this.props.icon
            return (
                <div className="fcui2-dialog-alert">
                    <div className={icon} style={{color: this.props.iconColor}}></div>
                    <span>{this.props.message}</span>
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
                icon: 'font-icon-warning',
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
            var icon = 'font-icon ' + this.props.icon
            return (
                <div className="fcui2-dialog-alert">
                    <div className={icon} style={{color: this.props.iconColor}}></div>
                    <span>{this.props.message}</span>
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
        document.body.appendChild(me.background);
        document.body.appendChild(me.container);
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
        me.ui = React.render(React.createElement(popWindow, param), me.container, loaded);
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
        React.unmountComponentAtNode(this.container);
        document.body.removeChild(this.container);
        document.body.removeChild(this.background);
        this.ui = null;
    };


    return Dialog;
});
