/**
 * 全局提示
 * @author zhangjialin
 * @email zhangjialin03@baidu.com
 * @version 0.0.2.1
 * @note
 *      全局展示操作反馈信息，居中显示并自动消失，单例模式，可提供“成功”等反馈信息
 */

define(function(require) {
    const React = require('react');
    const ReactDOM = require('react-dom');
    var _ = require('underscore');
    var cTools = require('./core/componentTools');
    var language = require('./core/language').toast;

    let toastInstance;

    const toastType = {
        SUCCESS: 'success',
        ERROR: 'error'
    };

    const iconType = {
        success: 'fcui2-icon fcui2-icon-success',
        error: 'fcui2-icon fcui2-icon-failed'
    };

    let defaultProps = {
        className: '',
        classPrefix: 'fcui2-toast',
        type: toastType.SUCCESS,
        icon: '',
        message: '',
        size: '',
        subComponent: '',
        autoHideTime: 2000,
        onClose: cTools.noop
    };

    /**
     * @constructor
     * @name Toast
     */

    class Toast {
        getContainer() {
            if (!document)
                return;

            if (this.___container___) {
                return this.___container___;
            }
            else {
                let className = defaultProps.classPrefix + '-container';
                let container = document.createElement('div');

                container.className = className;
                this.___container___ = container;
                return container;
            }
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
        * @param {Number} param.autoHideTime 自动隐藏时间容迟，单位：毫秒
        * @param {Function} param.onClose Toast关闭的回调函数
        */

        pop(props) {
            // 创建元素
            let me = this;
            props = _.extend({}, defaultProps, props);
            document.body.appendChild(this.getContainer());
            me.___ui___ = null;

            ReactDOM.render(<ToastComponent {...props}/>, me.getContainer(), function(ref) {
                me.___ui___ = this;
                me.resize(props);
            });

            this.___ui___ = null;
            // 销毁元素
            setTimeout(function() {
                me.dispose();
                typeof props.onClose === 'function' && props.onClose();
            }, props.autoHideTime);
        }

        resize(props) {
            let content = this.getContainer().childNodes[0];
            if (!content) {
                return;
            }
            let size = props.size;
            if (!size || (size && !size.width && !size.height && !props.subComponent)) {
                let width = content.clientWidth;
                content.style.marginLeft = - (width / 2) + 'px';
            } else {
                let width = isNaN(size.width) || size.width == null ? content.offsetWidth : +size.width;
                let height = isNaN(size.height) || size.height == null ? content.offsetHeight : +size.height;
                content.style.width = width + 'px';
                content.style.height = height + 'px';
                content.style.marginLeft = '-' + (width / 2) + 'px';
                content.style.marginTop = '-' + (height / 2) + 'px';
            }
        }

        dispose() {
            ReactDOM.unmountComponentAtNode(this.getContainer());
            document.body.removeChild(this.getContainer());
        }
    }

    const ToastComponent = React.createClass({
        // @override
        getInitialState() {
            return {};
        },

        render() {
            let {message, type, icon, subComponent, onClose, classPrefix} = this.props;
            let toastMsg = message || language[type] || null;
            let toastIcon = icon || iconType[type];
            let Component = subComponent;

            let containerProp = cTools.containerBaseProps('toast', this, {
                mergeFromProps: Object.keys(this.props).filter(e => e !== 'classPrefix' && e !== 'subComponent')
            });

            return (
                <div {...containerProp}>
                    {subComponent
                        ? <Component />
                        : <div>
                            <div className={classPrefix + '-mask'}></div>
                                <div className={classPrefix + '-content'}>
                                <i className={classPrefix + '-icon ' + toastIcon}></i>
                                <span className={classPrefix + '-text'}>
                                    {toastMsg}
                                </span>
                            </div>
                        </div>
                    }
                </div>
            );
        }
    });

    return toastInstance = toastInstance || new Toast();
})
