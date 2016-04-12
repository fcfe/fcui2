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
        + 'If you want to use value/checked or onChange, you probably don\'t want to use valueLink.'
    var inputHandlers = [
        'onKeyDown', 'onKeyPress', 'onKeyUp',
        'onBlur', 'onFocus', 'onSelect',
        'onClick', 'onDoubleClick',
        'onMouseDown', 'onMouseEnter', 'onMouseLeave',
        'onMouseMove', 'onMouseOut', 'onMouseOver', 'onMouseUp'
    ];

    return {

        /**
         * 检查valueLink、value、onChange
         *
         * @override
         * 组件初始化前，检查valueLink和value + onChange，同时存在则抛错，并阻塞系统
         */
        componentWillMount: function () {
            var props = this.props;
            var valueField = this.props.___uitype___ === 'checkbox' || this.props.___uitype___ === 'radio'
                ? 'checked' : 'value';
            this.___hasValueLink___ = props.hasOwnProperty('valueLink')
                && props.valueLink.hasOwnProperty('value')
                && typeof props.valueLink.requestChange === 'function';
            if (this.___hasValueLink___ && (props.hasOwnProperty(valueField) || props.hasOwnProperty('onChange'))) {
                throw new Error(erroeMessage);
            }
        },

        /**
         * 将组件props中输入有关的回调函数merge到实际的input dom上
         *
         * @param {Object} inputProps input dom props
         * @param {Object} 组件的props
         */
        ___mergeInputHandlers___: function (inputProps, props) {
            for (var i = 0; i < inputHandlers.length; i++) {
                var key = inputHandlers[i];
                if (
                    inputProps.hasOwnProperty(key)
                    || !props.hasOwnProperty(key)
                    || typeof props[key] !== 'function'
                ) {
                    continue;
                }
                inputProps[key] = props[key];
            }
        },

        /**
         * 获取value
         *
         * @return {AnyType} 输入组件当前值
         * 0.radio做了非常特殊的处理
         * 1.如果用户使用了valueLink，则返回valueLink记录的值
         * 2.不满足1，如果用户通过props.value设置value，则返回props.value
         * 3.不满足2，如果组件state中存储了临时值，返回这个临时值
         * 4.不满足3，如果组件存在默认值模版，返回值模板
         * 5.不满足4，返回null
         */
        ___getValue___: function () {
            var valueField = this.props.___uitype___ === 'checkbox' || this.props.___uitype___ === 'radio'
                ? 'checked' : 'value';
            // 对radio进行特殊处理
            // 由于操作radio，可能引起其他radio值的改变，因此如果radio已经渲染出来了，
            // 此方法应该返回dom自带的值
            if (
                this.props.___uitype___ === 'radio'
                && this.refs.hasOwnProperty('inputbox')
                && typeof this.props.name === 'string'
                && this.props.name.length > 0
            ) {
                return this.refs.inputbox.checked;
            }
            // 常规input组件
            if (this.___hasValueLink___) return this.props.valueLink.value;
            if (this.props.hasOwnProperty(valueField)) return this.props[valueField];
            if (this.state && this.state.hasOwnProperty('___value___')) return this.state.___value___;
            if (this.props.hasOwnProperty('valueTemplate')) return this.props.valueTemplate;
            return null;
        },

        /**
         * 分发onChange事件
         *
         * @param {event} e 触发的dom事件
         */
        ___dispatchChange___: function (e, value) {
            var valueField = this.props.___uitype___ === 'checkbox' || this.props.___uitype___ === 'radio'
                ? 'checked' : 'value';
            var value = arguments.length > 1 ? value : e.target[valueField];
            if (this.___hasValueLink___) {
                this.props.valueLink.requestChange(value);
            }
            else if (typeof this.props.onChange === 'function') {
                this.props.onChange(e, value);
            }
            this.setState({
                ___value___: value,
                ___beOperated___: true
            });
        }
    };
});
