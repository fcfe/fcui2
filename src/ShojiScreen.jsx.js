/**
 * 侧拉门
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 * @note
 *      Shoji <日> n.障子，日本房屋用的纸糊木框，亦作shoji screen。如用木框糊纸的拉窗、拉门、纸拉窗、纸拉门。
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


        /**
         * @properties
         * @param {String} className 添加到ShojiScreen容器上的类，此容器为内部容器，将添加到body中，是ShojiScreen content根容器的外壳
         * @param {Object} skin 挂在ShojiScreen容器上的皮肤
         * @param {Number} workspaceWidth ShojiScreen工作区宽度
         * @param {Boolean} isOpen ShojiScreen是否显示，如果为true，layer容器将被添加到body中
         * @param {String} footBarInnerHtml 写入Shoji下部按钮后面的html
         * @param {Boolean} showFootBar 是否显示底部按钮栏
         * @param {Object} buttonLabels 按钮话术
         * @param {String} buttonLabels.enter 确定按钮
         * @param {String} buttonLabels.cancel 取消按钮
         * @param {String} buttonLabels.expand 展开按钮
         * @param {String} buttonLabels.hide 隐藏按钮
         * @param {Function} onAction 功能回调接口
         * @param {Function} onRender ShojiScreen渲染完成后的回调
         * @param {Function} onBeforeClose ShojiScreen关闭前触发的回调，可以在这个回调中阻止窗体关闭
         * @param {Function} onClose ShojiScreen关闭后的回调 
         */
        /**
         * @fire Import src\TitleWindow.jsx.js TitleWindow onBeforeClose
         */
        /**
         * @fire ShojiScreen onAction
         * @param {String} type 回调类型：
         * 'EnterButtonClick'   确定按钮被点击
         * 'CancelButtonClick'  取消按钮被点击
         * 'HideButtonClick'    收起按钮被点击
         * 'ExpandButtonClick'  展开按钮被点击
         */
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                skin: '',
                workspaceWidth: 1000,
                isOpen: false,
                showFootBar: false,
                footBarInnerHtml: '',
                buttonLabels: {
                    enter: language.enter,
                    cancel: language.cancel,
                    hide: language.hide,
                    expand: language.expand
                },
                onRender: noop,
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

            workspace.innerHTML = [
                '<div class="content">',
                '</div>',
                '<div class="button-bar">',
                    '<div data-ui-cmd="EnterButtonClick" class="metro-button highlight-button"></div>',
                    '<div data-ui-cmd="CancelButtonClick" class="metro-button normal-button"></div>',
                    '<div class="button-bar-right-container"></div>',
                '</div>',
                '<div class="hide-button metro-button highlight-button"></div>'
            ].join('');

            this.___container___ = container;
            this.___workspace___ = workspace;
            this.___content___ = workspace.childNodes[0];
            this.___expandButton___ = expandButton;
            this.___enterButton___ = workspace.childNodes[1].childNodes[0];
            this.___cancelButton___ = workspace.childNodes[1].childNodes[1];
            this.___hideButton___ = workspace.childNodes[2];
            this.___footBarContent___ = workspace.childNodes[1].childNodes[2];
            
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
            typeof this.props.onAction === 'function' && this.props.onAction('HideButtonClick');
        },


        onExpand: function (e) {
            if (!this.___container___ || !this.props.isOpen || !this.___appended___) return;
            document.body.appendChild(this.___container___);
            document.body.style.overflow = 'hidden';
            document.body.removeChild(this.___expandButton___);
            typeof this.props.onAction === 'function' && this.props.onAction('ExpandButtonClick');
        },


        onButtonBarClick: function (e) {
            var dataset = util.getDataset(e.target);
            if (!dataset.uiCmd) return;
            typeof this.props.onAction === 'function' && this.props.onAction(dataset.uiCmd);
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
                var buttonLabels = props.buttonLables || {};
                this.___expandButton___.innerHTML = buttonLabels.expand ? buttonLabels.expand : language.expand;
                this.___enterButton___.innerHTML = buttonLabels.enter ? buttonLabels.enter : language.enter;
                this.___cancelButton___.innerHTML = buttonLabels.cancel ? buttonLabels.cancel : language.cancel;
                this.___hideButton___.innerHTML = buttonLabels.hide ? buttonLabels.hide : language.hide;
                this.___container___.className = 'fcui2-shojiscreen'
                    + (typeof className === 'string' && className ? (' ' + className) : '')
                    + ' fcui2-shojiscreen-' + (typeof skin === 'string' && skin ? skin : 'normal')
                    + (props.showFootBar ? '' : ' fcui2-shojiscreen-hide-foot-bar');
                this.___workspace___.style.width = (isNaN(width) ? 1000 : width) + 'px';
                this.___footBarContent___.innerHTML = typeof props.footBarInnerHtml === 'string'
                    ? props.footBarInnerHtml : '';
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
