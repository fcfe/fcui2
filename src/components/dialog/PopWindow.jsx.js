define(function (require) {


    var Button = require('./Button.jsx');
    var React = require('react');
    var ReactDOM = require('react-dom');


    // 窗口，包含title bar 和content container
    return React.createClass({
        // @override
        getDefaultProps : function () {
            return {
                title: 'PopWindowTitle',
                ___dialogContainer___: null,
                content: null,
                contentProps: null,
                onClose: function () {},
                onDispose: function () {}
            };
        },
        // @override 启动后装载content
        componentDidMount: function () {
            var me = this;
            if (typeof me.props.content === 'function' && typeof me.props.contentProps === 'object') {
                me.updateContentProps(me.props.contentProps);
            }
            else {
                me.resizeHandler();
            }
        },
        // 运行期重新渲染content
        updateContentProps: function (props) {
            var me = this;
            var contentProps = props || {};
            // content调用dispose直接销毁窗口，不触发任何事件
            contentProps.dispose = function () {
                me.props.onDispose();
            };
            // content调用close会相继触发onBeforeClose、onClose
            contentProps.close = function () {
                me.closeHandler();
            };
            // content调用resize，触发dialog重新计算尺寸和位置，一般在subapp.componentDidUpdate中使用
            contentProps.resize = function () {
                var result = me.resizeHandler();
                return result;
            };
            try {
                me.content = ReactDOM.render(
                    React.createElement(me.props.content, contentProps),
                    me.refs.content,
                    function () {me.resizeHandler();}
                );
            }
            catch (e) {
                console.error(e);
                me.resizeHandler();
            }
        },
        // 点击Title Bar的关闭会触发，content内部调用props.close也会触发
        closeHandler: function () {
            var evt = document.createEvent('UIEvents');
            evt.fcuiTarget = this;
            this.props.onClose(evt);
        },
        resizeHandler: function () {
            var doc = document.documentElement;
            var container = this.props.___dialogContainer___;
            var title = this.refs.title;
            var content = this.refs.content;
            var width = 0;
            var height = 0;
            if (!content) return false;
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
            return true;
        },
        render: function () {
            return (
                <div ref="container">
                    <div className="title-bar" ref="title">
                        <span>{this.props.title}</span>
                        <div className="font-icon font-icon-times" onClick={this.closeHandler}></div>
                    </div>
                    <div ref="content" className="content"></div>
                </div>
            );
        }
    });


});
