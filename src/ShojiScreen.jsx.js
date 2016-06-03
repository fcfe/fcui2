/**
 * @file 横拉谈层
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 *
 * 注：<日> n.障子，日本房屋用的纸糊木框，亦作shoji screen。如用木框糊纸的拉窗、拉门、纸拉窗、纸拉门。
 */
define(function (require) {


    var React = require('react');
    var ReactDOM = require('react-dom');
    var renderSubtreeIntoContainer = require("react-dom").unstable_renderSubtreeIntoContainer;
    var util = require('./core/util');
    var tools = require('./core/shojiScreenTools');
    var language = require('./core/language').shojiScreen;
    var noop = function () {};


    return React.createClass({


        // @override
        getDefaultProps: function () {
            return {
                className: '',
                skin: '',
                workspaceWidth: 1000,
                isOpen: false,
                onRender: noop,
                // 页面有某些操作后的回调：类似于table的onAction，回调第一个参数为type，第二个为param 
                // type分别是：EnterButtonClick, CancelButtonClick, HideButtonClick, ExpandButtonClick
                onAction: noop, 
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
            var expandButton = document.createElement('div');

            container.className = 'fcui2-shojiscreen';
            background.className = 'fcui2-shojiscreen-background';
            workspace.className = 'fcui2-shojiscreen-workspace';
            expandButton.className = 'fcui2-shojiscreen-expand-button';

            container.appendChild(background);
            container.appendChild(workspace);

            expandButton.innerHTML = language.expand;
            workspace.innerHTML = [
                '<div class="content">',
                '</div>',
                '<div class="button-bar">',
                    '<div data-ui-cmd="EnterButtonClick" class="metro-button highlight-button">',
                        language.enter,
                    '</div>',
                    '<div data-ui-cmd="CancelButtonClick" class="metro-button normal-button">',
                        language.cancel,
                    '</div>',
                '</div>',
                '<div class="hide-button metro-button highlight-button">' + language.hide + '</div>'
            ].join('');

            this.___container___ = container;
            this.___workspace___ = workspace;
            this.___expandButton___ = expandButton;
            this.___content___ = workspace.childNodes[0];
            this.___appended___ = false;

            workspace.childNodes[1].addEventListener('click', this.onButtonBarClick);
            workspace.childNodes[2].addEventListener('click', this.onHidden);
            expandButton.addEventListener('click', this.onExpand);

            this.renderSubTree(this.props);
        },


        // @override
        componentWillUnmount: function () {
            this.removeSubTree();
        },


        // @override
        componentWillReceiveProps: function(newProps) {
            this.renderSubTree(newProps);
        },


        onHidden: function (e) {
            if (!this.___container___ || !this.props.isOpen || !this.___appended___) return; 
            document.body.removeChild(this.___container___);
            document.body.style.overflow = this.___oldOverflow___;
            document.body.appendChild(this.___expandButton___);
            tools.addExpandButton(this.___expandButton___);
            tools.freshExpandButton();
            typeof this.props.onAction === 'function' && this.props.onAction('HideButtonClick', {});
        },


        onExpand: function (e) {
            if (!this.___container___ || !this.props.isOpen || !this.___appended___) return;
            document.body.appendChild(this.___container___);
            document.body.style.overflow = 'hidden';
            document.body.removeChild(this.___expandButton___);
            typeof this.props.onAction === 'function' && this.props.onAction('ExpandButtonClick', {});
        },


        onButtonBarClick: function (e) {
            var dataset = util.getDataset(e.target);
            if (!dataset.uiCmd) return;
            typeof this.props.onAction === 'function' && this.props.onAction(dataset.uiCmd, {});
        },


        // 销毁窗体，并且会触发this.props.onBeforeClose和this.props.onClose
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


        renderSubTree: function (props) {
            // 返回条件1：初始化失败
            // 返回条件2：不让弹出，并且没有添加
            if (!this.___container___ || (!props.isOpen && !this.___appended___)) return;  
            // open
            // 返回条件3：让弹出
            if (props.isOpen) {
                var width = this.props.workspaceWidth;
                var className = props.className;
                var skin = props.skin;
                this.___container___.className = 'fcui2-shojiscreen'
                    + (typeof className === 'string' && className ? (' ' + className) : '')
                    + ' fcui2-shojiscreen-' + (typeof skin === 'string' && skin ? skin : 'normal');
                this.___workspace___.style.width = (isNaN(width) ? 1000 : width) + 'px';
                if (!this.___appended___) {
                    this.___oldOverflow___ = util.getStyle(document.body, 'overflow');
                    document.body.appendChild(this.___container___);
                    document.body.style.overflow = 'hidden';
                    this.___appended___ = true;
                }
                renderSubtreeIntoContainer(this, props.children, this.___content___, function () {
                    typeof props.onRender === 'function' && props.onRender();
                });
                return;
            }
            // close
            this.removeSubTree();
        },


        // 销毁窗体，不会触发任何事件，直接干掉
        removeSubTree: function () {
            if (!this.___appended___) return;
            ReactDOM.unmountComponentAtNode(this.___content___);
            try {
                document.body.removeChild(this.___container___);
                document.body.style.overflow = this.___oldOverflow___;
            }
            catch (e) {
                // DO NOTHING
            }
            try {
                document.body.removeChild(this.___expandButton___);
            }
            catch (e) {
                // DO NOTHING
            }
            tools.removeExpandButton(this.___expandButton___);
            tools.freshExpandButton();
            this.___appended___ = false;
        },


        render: function () {
            return React.DOM.noscript();
        }


    });
});
