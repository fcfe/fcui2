/**
 * Input类型组件基础mixin
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 * @note
 * ###说明文档
 * ####1 此mixin作用
 * #####1.1 同步input类型组件表现
 * ######1.1.1 错误的属性配置提示 
 * React中，原生DOM可以使用valueLink绑定value到父级组件state，但valueLink属性跟onChange + value属性互斥，且会抛出提示。
 * 本mixin解决了这个问题，让自定义input组件具有和原生DOM一致的配置原则。
 * ######1.1.2 读值和派发的统一
 * input类型组件含有valueLink属性时，组件的value数据源和onChange回调被封装在props.valueLink内部，
 * 与不含有valueLink属性时解决方案不同，本mixin提供获取value的公共方法，同时提供派发回调的公共接口。
 * #####1.2 衔接外部Form组件
 * ######1.2.1 输入域注册
 * input类型组件有两种状态：一种是独立使用；一种是在表单内部作为表单的输入域使用。当input组件配置name属性后，
 * 需要检测外层是否存在Form组件，如果存在，需要在Form中注册自身，以达到与Form协作的目的。本mixin解决了自动注册的问题。
 * ######1.2.2 输入域校验
 * input类型组件的值发生变动时，常需要进行一系列校验，此mixin提供了校验机导入与执行接口。
 * ######1.2.3 域数据更新
 * input组件在Form组件内部时，如果配置了name属性，会成为Form的一个输入域。其值发生变化时，需要通知Form更新。
 * 本mixin完成了这一功能。
 * ####2 此mixin依赖
 * #####2.1 props依赖，见this.props注释
 * #####2.2 value类型的建议
 * 我们规定input类型组件的值为基础类型：string、number、boolean，复杂类型都应转换成string对外输出，具体原因如下：
 *
 * * 我们添加了对valueLink的支持，基础类型在外部state中更加安全；
 * * 基础类型可以阻止用户对value进行指针操作；复杂类型的value如果操作不当，可能对组件造成毁灭性打击。
 * * 保持自定义input类型组件与原生input dom的表现一致，也就是可以通过e.target.value或e.target.checked获取值，而e.target是组件的根dom节点，复杂类型是不能给dom.value赋值的。
 * * 保持与原生一致，主要是降低用户对组件的学习成本，同时允许用户使用更通用的onChange处理方法。
 * #####2.3 关于校验机validations属性配置
 * * 所有input类型组件都可以通过this.props.validations属性传入校验机对象，即一组校验规则。
 * * this.props.validations可以是一个对象，也可以是字符串；如果是字符串，内部将把它用JSON.parse转成对象。
 * * 校验机的key为校验规则名称，可以是自定义名称，也可以是内部常用校验机的名称。关于内部常用校验机，见src\core\validations.js。
 * * 自定义校验机，其值必须是一个函数，此函数返回值为boolean|string|ValidateResult，如果返回string，表示未通过该校验。
 * * 在使用内置校验机时，其值将被当作形参传入内置校验机。
 * #####2.4 关于校验结果customErrorTemplates属性配置
 * * 校验结果属性为一个简单对象，键为校验准则名称，值为校验未通过时应当返回的错误信息；
 * * 此属性一般用于覆盖内置校验机的结果提示，自定义校验机可以在校验函数中直接返回字符串当作错误提示。
 * ####3 此mixin输出
 * #####3.1 this.state注入
 * * this.state.___value___      {String|Number|Boolean} 组件的临时值，只有当props中未传入value且未使用valueLink时，此项才被读取。
 * * this.state.___beOperated___ {Boolean} 组件是否被操作过。
 * * this.state.isValid          {Boolean} 组件是否通过了校验，此项一般由组件外部的Form设置。
 * #####3.2 this实例注入
 * * this.___hasValueLink___ {boolean} 实例属性中是否含有valueLink插件。
 * * this.___formAttached___ {boolean} 实例是否在外部表单中成功注册。
 * * this.___validations___  {Object}  经过转换的校验机对象。
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


        /*
         * 检查valueLink、value、onChange
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


        /*
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


        /*
         * 解除表单域注册
         *
         * @override
         */
        componentWillUnmount: function () {
            if (validationTools.isCallbackExist(this, 'detach')) {
                this.context.___form___.detach(this.props.name, this);
            }
        },


        /*
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
         * 获取value接口
         * @interface ___getValue___
         * @return {String|Number|Boolean} 组件的值
         * @note
         * * Radio做了特殊处理，返回DOM实际值。
         * * 如果用户使用了valueLink，则返回valueLink记录的值；
         * * 否则，如果用户通过props.value或props.checked设置了值，则返回props.value或props.checked
         *（注意，props.checked仅对CheckBox和Radio有效）；
         * * 否则，如果组件state中存储了临时值___value___，返回这个临时值；
         * * 否则，如果组件设置了默认值模版props.valueTemplate，返回模板值；
         * * 否则，返回null
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
         * 派发onChange接口
         * @interface ___dispatchChange___
         * @param {SyntheticEvent} e React事件对象
         * @param {HtmlElement} e.target 触发派发的组件的响应dom或根容器
         * @param {string|number|boolean} e.target.value 值
         * @param {string|number|boolean} value 值2，如果传入这个参数，将派发这个值，而不派发e.target.value
         * @param {string|number|boolean} lastValue 旧值，如果没有配置valueLink或onChange，则视为派发失败，组件的值将被换原成此值，前提是调用时传入此值
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
         * 执行校验
         * @interface validate
         * @param {?Array.<string>} rules 校验准则序列，如果不传入此参数，则校验配置的所有准则
         * @param {?Any} value 待校验的值，如果传入此参数，则校验此参数，否则校验组件内部的value
         * @return {Array.<string>} 校验结果数组，如果校验全部通过，返回一个空数组
         * @note
         * 返回的数组被加了一个名为resultsHash的属性，以hash方式存储校验结果，其key为未通过的校验准则，值为结果提示
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
                var args = [value];
                if (defaultValidations.hasOwnProperty(rule)) {
                    if (validations[rule] instanceof Array) {
                        args = args.concat(validations[rule]);
                    }
                    else {
                        args.push(validations[rule]);
                    }
                }
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
