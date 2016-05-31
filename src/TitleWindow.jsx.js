/**
 * @file 功能性弹层组件，用法跟Dialog不一样，这个更先进
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var ReactDOM = require('react-dom');
    var renderSubtreeIntoContainer = require("react-dom").unstable_renderSubtreeIntoContainer;
    var noop = function () {};


    return React.createClass({


        // @override
        getDefaultProps: function () {
            return {
                className: '',
                skin: '',
                isOpen: false,
                title: 'Title Window',
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


        close: function () {
            var evt = document.createEvent('UIEvents');
            evt.targteComponent = this;
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
            if (height > doc.clientHeight) width += 20;
            // 设置尺寸并移入可视区
            container.style.width = width + 'px';
            container.style.height = height + 'px';
            container.style.left = 0.5 * (doc.clientWidth - container.clientWidth) + 'px';
            container.style.top = 0.38 * (doc.clientHeight - container.clientHeight) + 'px';
            content.className = 'content content-fixed';
        },


        renderSubTree: function (props) {
            // update
            if (!this.___container___) return;
            var container = this.___container___;
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
                    document.body.appendChild(container);
                    this.___appended___ = true;
                }
                renderSubtreeIntoContainer(this, props.children, this.___content___, function () {
                    me.resize();
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
            document.body.removeChild(this.___container___);
            this.___appended___ = false;
        },


        render: function () {
            return React.DOM.noscript();
        }


    });
});
