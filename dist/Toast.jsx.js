var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 全局提示
 * @author zhangjialin
 * @email zhangjialin03@baidu.com
 * @version 0.0.2.1
 * @note
 *      全局展示操作反馈信息，居中显示并自动消失，单例模式，可提供“成功”等反馈信息
 */

define(function (require) {
    var React = require('react');
    var ReactDOM = require('react-dom');
    var Skin = require('./Skin.jsx');
    var util = require('./core/util');
    var cTools = require('./core/componentTools');
    var language = require('./core/language').toast;

    var toastInstance = void 0;

    var toastType = {
        SUCCESS: 'success',
        ERROR: 'error'
    };

    var iconType = {
        success: 'fcui2-icon fcui2-icon-success',
        error: 'fcui2-icon fcui2-icon-failed'
    };

    var defaultProps = {
        className: '',
        classPrefix: 'fcui2-toast',
        type: toastType.SUCCESS,
        icon: '',
        message: '',
        size: '',
        subComponent: null,
        subComponentCloseHandlerName: 'close',
        subComponentProps: {},
        autoHideTime: 2000,
        onClose: cTools.noop
    };

    /**
     * @constructor
     * @name Toast
     */

    var Toast = function () {
        function Toast() {
            _classCallCheck(this, Toast);
        }

        _createClass(Toast, [{
            key: 'getContainer',
            value: function getContainer() {
                if (!document) return;
                if (this.___container___) return this.___container___;
                var className = defaultProps.classPrefix + '-container';
                var container = document.createElement('div');
                container.className = className;
                this.___container___ = container;
                return container;
            }

            /**
              * 弹出窗体
              *
              * @name pop
              * @className Toast
              * @param {Object} param 弹出配置
              * @param {String} param.className 挂在到Toast窗体DOM上的class
              * @param {String} param.type 当前的状态,默认返回success样式
              * @param {String} param.icon 展示的icon,可自定义图标样式
              * @param {String} param.message 展示的信息文本，默认为'保存成功',配置message后type原有话术将被替换
              * @param {Object} param.size Toast的宽高
              * @param {Number} param.size.width 宽度
              * @param {Number} param.size.height 高度
              * @param {Object} param.subComponent 传入React组件，作为Toast的内容
              * @param {Object} param.subComponentProps subComponent初始化事传入的props
              * @param {String} param.subComponentCloseHandlerName 透传给subComponent的关闭事件属性名
              * @param {Number} param.autoHideTime 自动隐藏时间容迟，单位：毫秒，如果设置为0，不自动关闭
              * @param {Function} param.onClose Toast关闭的回调函数
              */

        }, {
            key: 'pop',
            value: function pop(props) {
                // 创建元素
                var me = this;
                props = util.extend({}, defaultProps, props, {
                    close: function close() {
                        me.dispose();
                    }
                });
                document.body.appendChild(this.getContainer());
                me.___ui___ = ReactDOM.render(React.createElement(ToastComponent, props), me.getContainer(), function (ref) {
                    if (this) me.___ui___ = this;
                    me.resize(props);
                });

                this.___ui___ = null;
                // 销毁元素
                props.autoHideTime && setTimeout(function () {
                    me.dispose();
                    typeof props.onClose === 'function' && props.onClose();
                }, props.autoHideTime);
            }
        }, {
            key: 'resize',
            value: function resize(props) {
                var content = this.getContainer().childNodes[0];
                if (!content) {
                    return;
                }
                var size = props.size;
                if (!size || size && !size.width && !size.height && !props.subComponent) {
                    var width = content.clientWidth;
                    content.style.marginLeft = -(width / 2) + 'px';
                } else {
                    var _width = isNaN(size.width) || size.width == null ? content.offsetWidth : +size.width;
                    var height = isNaN(size.height) || size.height == null ? content.offsetHeight : +size.height;
                    content.style.width = _width + 'px';
                    content.style.height = height + 'px';
                    content.style.marginLeft = '-' + _width / 2 + 'px';
                    content.style.marginTop = '-' + height / 2 + 'px';
                }
            }
        }, {
            key: 'dispose',
            value: function dispose() {
                ReactDOM.unmountComponentAtNode(this.getContainer());
                document.body.removeChild(this.getContainer());
            }
        }]);

        return Toast;
    }();

    var ToastComponent = React.createClass({
        displayName: 'ToastComponent',

        // @override
        getInitialState: function getInitialState() {
            return {};
        },
        render: function render() {
            var _props = this.props,
                message = _props.message,
                type = _props.type,
                icon = _props.icon,
                subComponent = _props.subComponent,
                subComponentProps = _props.subComponentProps,
                subComponentCloseHandlerName = _props.subComponentCloseHandlerName,
                onClose = _props.onClose,
                classPrefix = _props.classPrefix;

            var toastMsg = message || language[type] || null;
            var toastIcon = icon || iconType[type];
            var Component = subComponent;
            var componentProps = util.extend({}, subComponentProps, _defineProperty({}, subComponentCloseHandlerName, this.props.close));
            var containerProp = cTools.containerBaseProps('toast', this, {
                mergeFromProps: Object.keys(this.props).filter(function (e) {
                    return e === 'className' || e === 'style';
                })
            });
            return React.createElement(
                'div',
                containerProp,
                subComponent ? React.createElement(
                    Skin,
                    { skin: this.props.skin },
                    React.createElement(Component, componentProps)
                ) : React.createElement(
                    'div',
                    null,
                    React.createElement('div', { className: classPrefix + '-mask' }),
                    React.createElement(
                        'div',
                        { className: classPrefix + '-content' },
                        React.createElement('i', { className: classPrefix + '-icon ' + toastIcon }),
                        React.createElement(
                            'span',
                            { className: classPrefix + '-text' },
                            toastMsg
                        )
                    )
                )
            );
        }
    });

    return toastInstance = toastInstance || new Toast();
});