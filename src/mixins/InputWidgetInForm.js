/**
 * @file 输入组件的表单mixin
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');
    var tools = require('../core/validationTools');
    var defaultValidations = require('../core/validations');


    return {


        contextTypes: {
            ___form___: React.PropTypes.object
        },


        // @override
        getDefaultProps: function () {
            return {
                // 输入组件在表单中的域
                name: '',
                // 输入组件的校验hash
                validations: {},
                // 输入组件校验失败的信息
                customErrorTemplates: {}
            };
        },


        /**
         * 注册表单域，更新校验对象
         */
        componentDidMount: function () {
            if (tools.isCallbackExist(this, 'attach')) {
                this.context.___form___.attach(this.props.name, this);
            }
            this.___validations___ = tools.validationFactory(this.props.validations);
        },


        /**
         * 解除表单域注册
         */
        componentWillUnmount: function () {
            if (tools.isCallbackExist(this, 'detach')) {
                this.context.___form___.detach(this.props.name, this);
            }
        },


        /**
         * 更新校验对象
         */
        componentWillReceiveProps: function(nextProps) {
            this.___validations___ = tools.validationFactory(nextProps.validations);
        },


        /**
         * 将通知给表单
         */
        componentDidUpdate: function () {
            if (tools.isCallbackExist(this, 'updateField') && this.state.___beOperated___ === true) {
                this.context.___form___.updateField(this.props.name, this.___getValue___(), this);
            }
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
            rules = tools.rulesFactory(this, rules);
            if (rules.length === 0) return [];
            var results = [];
            var customErrorTemplates = this.props.customErrorTemplates || {};
            var validations = this.___validations___ || {};
            value = value || this.___getValue___();
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
                if (typeof message === 'string' && message.length > 0) results.push(message);
            }
            return results;
        },
    };
});
