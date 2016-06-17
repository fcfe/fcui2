/*
 *  input类型组件基础mixin
 * @author Brian Li
 * @email lbxxlht@163.com
 *
 * 此mixin主要作用：
 * 1.解决input类型组件的渲染回馈问题
 * （1）原生dom可以使用valueLink绑定value到父级组件的state，但valueLink属性跟onChange + value属性是互斥的，且会抛错提示
 *      本mixin解决了上述问题，让自定义input组件具有和原生demo一致的属性表现
 * （2）input类型组件含有valueLink属性时，组件的数据源value和onChange回调被封装在props.valueLink内部，
 *      与不含有valueLink属性时解决方案不同，本mixin提供获取value的公共方法，同时提供派发回调的公共接口
 * 2.解决input类型组件与Form的衔接问题
 * （1）input类型组件配置name属性后要在包裹它的表单Form中注册自己
 * （2）input组件允许导入校验规则并根据这些规则进行校验
 * （3）input组件发生change事件时，通知表单指的变化
 *
 *
 * 使用此mixin的组件应包含如下内容：
 * [optional] this.props.value {string | boolean | number} 基础类型，表示组件的值
 * [optional] this.props.onChange {function} 组件被操作后的回调
 * [optional] this.props.valueLink {Object} 替代this.props.value + this.props.onChange的valueLink插件
 * [optional] this.props.name {string} 组件在表单Form中的域名
 * [optional] this.props.validations {Object} 组件值的校验机
 * [optional] this.props.customErrorTemplates {Object} 组件值校验失败后错误提示处理机
 *
 *
 * 此mixin在state中注入如下内容：
 * （1）this.state.___value___ {Any} 组件的临时值，只有当props中未传入value且未使用valueLink时，此项才被读取
 * （2）this.state.___beOperated___ {boolean} 组件是否被操作过
 * （3）this.state.isValid {boolean} 组件是否通过了校验，此项一般由组件外部的Form设置
 *
 *
 * 此mixin在组件实例中注入如下内容：
 * （1）this.___hasValueLink___ {boolean} 实例属性中是否含有valueLink
 * （2）this.___formAttached___ {boolean} 实例是否在表单中注册成功
 * （3）this.___validations___ {Object} this.props.validations配置转换好的校验hash
 */

/**
 * @properties
 * @param {String|boolean|number} value 组件的值，具体类型视具体组件而定
 * @param {Function} onChange 组件发生输入后触发的回调
 * @param {String} name 组件在Form表单中的域名，如果Form中有多个同名输入组件，则最靠上的有效，Radio除外
 * @param {Object} validations 组件的校验机，参见src\mixins\InputWidget.js
 * @param {Object} customErrorTemplates 组件的校验结果机，参见src\mixins\InputWidget.js
 * @param {String|boolean|number} valueTemplate 组件的默认值，优先级最低，参见src\mixins\InputWidget.js
 * @param {Object} valueLink React官方的valueLink插件对象，此对象与value + onChange组合互斥
 */


/**
 * @fire XXX onChange
 * @param {SyntheticEvent} e React事件对象
 * @param {HtmlElement} e.target 组件根容器
 * @param {String|Number|Boolean} e.target.value 组件的值，类型视具体组件而定
 */
define(function (require) {


    var React = require('react');
    var validationTools = require('../core/validationTools');
    var defaultValidations = require('../core/validations');
    var erroeMessage = 'Uncaught Invariant Violation:'
        + ' Cannot provide a valueLink and a value or onChange event. '
        + 'If you want to use value/checked or onChange, you probably can\'t use valueLink.';


    return {


        // @override
        contextTypes: {
            ___form___: React.PropTypes.object
        },


        /**
         * 检查valueLink、value、onChange
         * 组件初始化前，检查valueLink和value + onChange，同时存在则抛错，并阻塞系统
         *
         * @override
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
         * 注册表单域，更新校验对象
         *
         * @override
         */
        componentDidMount: function () {
            if (validationTools.isCallbackExist(this, 'attach')) {
                this.___formAttached___ = this.context.___form___.attach(this.props.name, this);
            }
            this.___validations___ = validationTools.validationFactory(this.props.validations || {});
        },


        /**
         * 解除表单域注册
         *
         * @override
         */
        componentWillUnmount: function () {
            if (validationTools.isCallbackExist(this, 'detach')) {
                this.context.___form___.detach(this.props.name, this);
            }
        },


        /**
         * 更新校验对象
         *
         * @override
         */
        componentWillReceiveProps: function(nextProps) {
            var valueField = this.props.___uitype___ === 'checkbox' || this.props.___uitype___ === 'radio'
                ? 'checked' : 'value';
            this.___validations___ = validationTools.validationFactory(nextProps.validations || {});
            this.___hasValueLink___ = nextProps.hasOwnProperty('valueLink')
                && nextProps.valueLink.hasOwnProperty('value')
                && typeof nextProps.valueLink.requestChange === 'function';
            if (
                this.___hasValueLink___
                && (nextProps.hasOwnProperty(valueField) || nextProps.hasOwnProperty('onChange'))
            ) {
                throw new Error(erroeMessage);
            }
        },


        /**
         * 获取value
         *
         * @return {AnyType} 输入组件当前值
         *
         * @notice
         * （0）radio做了非常特殊的处理
         * （1）如果用户使用了valueLink，则返回valueLink记录的值
         * （2）不满足1，如果用户通过props.value设置value，则返回props.value
         * （3）不满足2，如果组件state中存储了临时值，返回这个临时值
         * （4）不满足3，如果组件存在默认值模版，返回值模板
         * （5）不满足4，返回null
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
            if (this.props.hasOwnProperty(valueField) && this.props[valueField] !== undefined) {
                return this.props[valueField];
            }
            if (this.state && this.state.hasOwnProperty('___value___')) return this.state.___value___;
            if (this.props.hasOwnProperty('valueTemplate')) return this.props.valueTemplate;
            return null;
        },


        /**
         * 派发onChange事件
         *
         * @param {event} e dom事件
         * @param {HtmlElement} e.target 触发派发的组件的响应dom或根容器
         * @param {string | number | boolean} e.target.value input组件的新值
         * @param {Any} value 任意类型值
         * 
         * 有些组件的值很复杂，未必是简单类型，用e.target.value携带不了，从第二参数回调
         */
        ___dispatchChange___: function (e, value, lastValue) {

            // 准备value
            var valueField = this.props.___uitype___ === 'checkbox' || this.props.___uitype___ === 'radio'
                ? 'checked' : 'value';
            var value = arguments.length > 1 ? value : e.target[valueField];
            var noCallback = false;

            // 派发change
            if (this.___hasValueLink___) {
                this.props.valueLink.requestChange(value);
            }
            else if (typeof this.props.onChange === 'function') {
                this.props.onChange(e, value);
            }
            else if (this.props.hasOwnProperty(valueField)){
                noCallback = true;
            }

            // 通知表单
            if (this.___formAttached___ && validationTools.isCallbackExist(this, 'updateField')) {
                this.context.___form___.updateField(this.props.name, value, this);
            }

            if (noCallback && lastValue !== undefined) {
                value = lastValue;
                if (this.refs && this.refs.inputbox) {
                    this.refs.inputbox.value = lastValue;
                    this.___lastFiredValue___ = lastValue;
                }
            }

            // 记录变更
            this.setState({
                ___value___: value,
                ___beOperated___: true
            });
        },


        /**
         * 手动调用校验
         *
         * @param {?Array.<string>} rules校验准则
         * @param {Any} value 如果传入了此参数，则校验此参数，否则校验组件内部的value
         * @return {Array.<string>} 校验结果数组，如果全部校验都通过，返回一个空数组
         *
         * 如果导入准则，则只检查this.___validations___和rules相交的准则
         * 否则检查所有this.___validations___中存在的准则
         */
        validate: function (rules, value) {
            rules = validationTools.rulesFactory(this, rules);
            if (rules.length === 0) return [];
            var results = [];
            var resultsHash = {};
            var customErrorTemplates = this.props.customErrorTemplates || {};
            var validations = this.___validations___ || {};
            value = value !== undefined ? value : this.state.___value___;
            for (var i = 0; i < rules.length; i++) {
                var rule = rules[i];
                if (!defaultValidations.hasOwnProperty(rule) && typeof validations[rule] !== 'function') {
                    console.error('Form does not have the validation for rule: ' + rule);
                    continue;
                }
                var validation = defaultValidations[rule] || validations[rule];
                var args = defaultValidations[rule] ? [value, validations[rule]] : [value];
                var result = validation.apply(null, args);
                if (result === true || result.isValid) continue;
                var message = customErrorTemplates[rule] || result.template || result;
                if (typeof message === 'string' && message.length > 0) {
                    results.push(message);
                    resultsHash[rule] = message;
                }
            }
            results.resultsHash = resultsHash;
            return results;
        }
    };
});
