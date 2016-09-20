/**
 * 弹窗
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var ReactDOM = require('react-dom');
    var renderSubtreeIntoContainer = require("react-dom").unstable_renderSubtreeIntoContainer;
    var util = require('./core/util');
    var noop = function () {};

    var ___oldOverflow___;
    var windowNum = 0;


    return React.createClass({
        /**
         * @properties
         * @param {String} className 添加到TitleWindow容器上的类，此容器为内部容器，将添加到body中，是TitleWindow content根容器的外壳
         * @param {Object} skin 挂在TitleWindow容器上的皮肤
         * @param {Boolean} isOpen TitleWindow是否显示，如果为true，layer容器将被添加到body中
         * @param {String} title TitleWindow标题栏中显示的标题
         * @param {Object} size TitleWindow窗体的尺寸，与isFullScreen互斥
         * @param {Number} size.width TitleWindow渲染后的宽度
         * @param {Number} size.height TitleWindow渲染后的高度
         * @param {Boolean} isFullScreen TitleWindow弹出后时候直接全屏显示
         * @param {Boolean} isAutoResize TitleWindow是否根据内容变化自动调整宽度
         * @param {Boolean} showCloseButton 是否显示TitleWindow标题栏中的关闭按钮
         * @param {Function} onRender TitleWindow渲染完成后的回调
         * @param {Function} onBeforeClose TitleWindow关闭前触发的回调，可以在这个回调中阻止窗体关闭
         * @param {Function} onClose TitleWindow关闭后的回调 
         */
        /**
         * @fire TitleWindow onBeforeClose
         * @param {UIEvents} e JS原生UI事件对象
         * @param {Boolean} e.returnValue 可以通过param1.returnValue = false的方法阻止继续关闭
         * @param {ReactComponent}  e.targetComponent 当前组件实例
         */
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                skin: '',
                isOpen: false,
                title: 'Title Window',
                size: {},
                isFullScreen: false,
                isAutoResize: true,
                showCloseButton: true,
                onRender: noop,
                onBeforeClose: noop,
                onClose: noop
            };
        },


        // @override
        componentDidMount: function () {

            if (!window || !document) return;

            var container = document.createElement('div');
            var background = document.createElement('div');
            var workspace = document.createElement('div');

            background.className = 'fcui2-titlewindow-background';
            container.className = 'fcui2-titlewindow-container';
            workspace.className = 'fcui2-titlewindow';
            workspace.style.left = '-9999px';
            workspace.style.top = '-9999px';
            workspace.innerHTML = [
                '<div class="title-bar">',
                    '<span></span>',
                    '<div class="font-icon font-icon-times" data-ui-cmd="title-window-close"></div>',
                '</div>',
                '<div class="content">',
                '</div>'
            ].join('');
            container.appendChild(background);
            container.appendChild(workspace);

            workspace.childNodes[0].childNodes[1].addEventListener('click', this.close);

            this.___container___ = container;
            this.___workspace___ = workspace;
            this.___content___ = workspace.childNodes[1];
            this.___appended___ = false;
            this.___workerTimer___ = null;

            window.addEventListener('resize', this.resize);
            this.renderSubTree(this.props);
        },


        // @override
        componentWillUnmount: function () {
            window.removeEventListener('resize', this.resize);
            this.removeSubTree();
        },


        // @override
        componentWillReceiveProps: function(newProps) {
            this.renderSubTree(newProps);
        },


        onWorkerRunning: function () {
            if (!this.props.isOpen) {
                clearInterval(this.___workerTimer___);
                return;
            }
            var width = this.___content___.childNodes[0].offsetWidth;
            var height = this.___content___.childNodes[0].offsetHeight;
            if (width !== this.___lastContentWidth___ || height !== this.___lastContentHeight___) {
                this.___lastContentWidth___ = width;
                this.___lastContentHeight___ = height;
                this.resize();
            }
        },


        close: function () {
            var evt = document.createEvent('UIEvents');
            evt.targetComponent = this;
            evt.returnValue = true;
            typeof this.props.onBeforeClose === 'function' && this.props.onBeforeClose(evt);
            if (evt.returnValue) {
                this.removeSubTree();
                typeof this.props.onClose === 'function' && this.props.onClose();
            }
        },


        resize: function () {
            var content = this.___content___;
            var container = this.___workspace___;
            var title = container.childNodes[0];
            var doc = document.documentElement;
            var width = 0;
            var height = 0;
            content.className = 'content';
            container.style.left = container.style.top = '-9999px';
            container.style.width = container.style.height = '9999px;'
            // 获取content尺寸并判断是否需要纵向滚动条
            width = content.offsetWidth;
            height = content.offsetHeight + title.offsetHeight;
            // 设置尺寸并移入可视区
            width = width > doc.clientWidth - 10 ? (doc.clientWidth - 10) : width;
            height = height > doc.clientHeight - 10 ? (doc.clientHeight - 10) : height;
            container.style.width = width + 'px';
            container.style.height = height + 'px';
            container.style.left = 0.5 * (doc.clientWidth - container.clientWidth) + 'px';
            container.style.top = 0.38 * (doc.clientHeight - container.clientHeight) + 'px';
            content.className = 'content content-fixed';
        },


        renderSubTree: function (props) {
            // update
            if (!this.___container___) return;
            var titleBar = this.___workspace___.childNodes[0];
            var className = props.className;
            var skin = props.skin;
            titleBar.childNodes[0].innerHTML = props.title;
            titleBar.childNodes[1].style.display = props.showCloseButton ? 'block': 'none';
            this.___workspace___.className = 'fcui2-titlewindow'
                + (typeof className === 'string' && className.length ? (' ' + className) : '')
                + ' fcui2-titlewindow-' + (typeof skin === 'string' && skin.length ? skin : 'normal');
            if (!props.isOpen && !this.___appended___) return;
            // open
            var me = this;
            if (props.isOpen) {
                if (!this.___appended___) {
                    ___oldOverflow___ = windowNum === 0 ? util.getStyle(document.body, 'overflow') : ___oldOverflow___;
                    windowNum++;
                    document.body.appendChild(this.___container___);
                    document.body.style.overflow = 'hidden';
                    if (props.size) {
                        var width = (props.size.width + '').replace('px', '');
                        var height = (props.size.height + '').replace('px', '');
                        if (!isNaN(width)) {
                            this.___content___.style.width = width + 'px';
                        }
                        if (!isNaN(height)) {
                            this.___content___.style.height = height + 'px';  
                        }
                    }
                    if (props.isFullScreen) {
                        var doc = document.documentElement;
                        this.___content___.style.width = (doc.offsetWidth - 10) + 'px';
                        this.___content___.style.height = (doc.offsetHeight - 10 - titleBar.offsetHeight) + 'px';
                    }
                    this.___appended___ = true;
                }
                renderSubtreeIntoContainer(this, props.children, this.___content___, function () {
                    me.resize();
                    // 有些时候，弹窗的内容往往会变化，导致content尺寸变化
                    // 如果窗体没有设置默认尺寸，需要根据content重新计算尺寸
                    // content直接调用resize也可以，但是那样很麻烦
                    if (
                        props.isAutoResize
                        && !props.isFullScreen
                        && (!props.size || (props.size && !props.size.width && !props.size.height))
                    ) {
                        me.___workerTimer___ = setInterval(function () {
                            me.onWorkerRunning();
                        }, 100); 
                    }
                    typeof props.onRender === 'function' && props.onRender();
                });
                return;
            }
            // close
            this.removeSubTree();
        },


        removeSubTree: function () {
            if (!this.___appended___) return;
            ReactDOM.unmountComponentAtNode(this.___content___);
            this.___workspace___.style.left = '-9999px';
            this.___workspace___.style.top = '-9999px'; 
            this.___content___.style.width = 'auto';
            this.___content___.style.height = 'auto'; 
            document.body.removeChild(this.___container___);
            document.body.style.overflow = windowNum === 1 ? ___oldOverflow___ : 'hidden';
            windowNum--;
            clearInterval(this.___workerTimer___);
            this.___appended___ = false;
        },


        render: function () {
            return React.DOM.noscript();
        }


    });
});
