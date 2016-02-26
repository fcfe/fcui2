/**
 * @file input类型组件基础mixin
 * @author Brian Li
 * @email lbxxlht@163.com
 *
 * 此mixin主要作用是解决input类型组件的渲染回馈问题
 * 原生dom可以使用valueLink绑定value到父级的state，但valueLink属性跟onChange + value属性是互斥的，且会抛错提示
 * 本mixin为了解决上述问题。
 * 同时，含有valueLink属性时，组件的value数据源和onChange回调被封装在props.valueLink内部，与不含有valueLink属性时
 * 来源不同，本mixin提供获取value的公共方法，同时提供派发回调的公共接口
 */
define(function (require) {

    var erroeMessage = 'Uncaught Invariant Violation:'
        + ' Cannot provide a valueLink and a value or onChange event. '
        + 'If you want to use value or onChange, you probably don\'t want to use valueLink.'

    return {

        /**
         * 检查valueLink、value、onChange
         *
         * @override
         * 组件初始化前，检查valueLink和value + onChange，同时存在则抛错，并阻塞系统
         */
        componentWillMount: function () {
            var props = this.props;
            this.___hasValueLink___ = props.hasOwnProperty('valueLink')
                && props.valueLink.hasOwnProperty('value')
                && typeof props.valueLink.requestChange === 'function';
            if (this.___hasValueLink___ && (props.hasOwnProperty('value') || props.hasOwnProperty('onChange'))) {
                throw new Error(erroeMessage);
            }
        },

        /**
         * 获取value，可以从prop中，也可以从valueLink中
         *
         * @return {AnyType} 输入组件当前值
         */
        ___getValue___: function () {
            return this.___hasValueLink___ ? this.props.valueLink.value : this.props.value;
        },

        /**
         * 分发onChange事件
         *
         * @param {event} e 触发的dom事件
         */
        ___dispatchChange___: function (e) {
            if (this.___hasValueLink___) {
                this.props.valueLink.requestChange(e.target.value);
            }
            else if (typeof this.props.onChange === 'function') {
                this.props.onChange(e);
            }
        }
    };
});
