define(function (require) {


    // 待弹出的窗口，包含title bar 和content container
    var popWindow = React.createClass({
        getDefaultProps : function () {
            return {title: 'PopWindowTitle'};
        },
        componentDidMount: function () {
            // 装载子对象
            var me = this;
            if (typeof this.props.content === 'function') {
                React.render(
                    React.createElement(this.props.content, this.props.contentProps),
                    this.refs.content.getDOMNode(),
                    function () {me.resize();}
                );
            }
            else {
                me.resize();
            }
        },
        resize: function () {
            var dom = this.getDOMNode().parentNode;
            var doc = document.documentElement;
            var left = 0.5 * (doc.clientWidth - dom.clientWidth);
            var top = 0.38 * (doc.clientHeight - dom.clientHeight);
            top = top < 0 ? 0 : top;
            dom.style.cssText = 'left:' + left + 'px;top:' + top + 'px';
        },
        closeHandler: function () {
            // TODO: check BeforeClose
            React.unmountComponentAtNode(this.refs.content.getDOMNode());
            if (typeof this.props.closeFromTitleBar === 'function') {
                this.props.closeFromTitleBar();
            }
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


    /**
     * dialog构造函数
     *
     * @param {Object} param 构造配置
     * @param {Function} param.onDispose 窗体销毁后的回调
     */
    function Dialog(param) {
        this.container = document.createElement('div');
        this.background = document.createElement('div');
        this.container.className = 'ui-dialog';
        this.background.className = 'ui-dialog-background';
        this.param = param || {};
        this.ui = null;
    }


    /**
     * 弹出dialog
     *
     * @param {Object} param dialog配置，直接导成popWindow的属性集合
     * @param {?string} param.title 标题
     * @param {Function} param.content dialog的子内容
     * @param {Object} param.contentProps content初始化时传入的属性集合
     */
    Dialog.prototype.pop = function (param) {
        param = param || {};
        var me = this;
        var doc = document.documentElement;

        document.body.appendChild(me.background);
        document.body.appendChild(me.container);

        param.closeFromTitleBar = function () {me.dispose()};
        me.ui = React.render(React.createElement(popWindow, param), this.container, loaded);

        function loaded() {
            var timer = setInterval(uiFocus, 10);
            function uiFocus() {
                if (!me.ui) return;
                clearInterval(timer);
                if (param.focus && me.ui.content.refs.hasOwnProperty(param.focus)) {
                    me.ui.content.refs[param.focus].getDOMNode().focus();
                } 
            }
        }
    };


    /**
     * 销毁窗体
     */
    Dialog.prototype.dispose = function () {
        React.unmountComponentAtNode(this.container);
        document.body.removeChild(this.container);
        document.body.removeChild(this.background);
        this.ui = null;
        if (typeof this.param.onDispose === 'function') {
            this.param.onDispose();
        }
    };


    return Dialog;
});
