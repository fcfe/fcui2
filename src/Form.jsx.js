/**
 * 表单组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */

define(function (require) {


    var React = require('react');
    var tools = require('./core/formTools');


    return React.createClass({

        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js className
         * @param {Object} validations 表单级别校验机，可以在这里放置跨域校验
         * @param {Function} onFieldChange 表单域发生变化后的回调
         * @param {Function} onSubmit 表单通过所有校验提交前触发的回调
         */
        // @override
        childContextTypes: {
            ___form___: React.PropTypes.object
        },
        // @override
        getChildContext: function () {
            return {
                ___form___: this
            };
        },
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                validations: {},
                onSubmit: function () {},
                onFieldChange: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        // @override
        componentWillMount: function () {
            // 存储输入域组件
            this.___inputs___ = {};
        },
        // @override
        render: function () {
            return (
                <form className={this.props.className} onSubmit={this.submit}>
                    {this.props.children}
                </form>
            );
        },

        /**
         * 注册表单输入域
         *
         * @interface attach
         * @param {String} name 输入域名称
         * @param {ReactComponent} component 输入域React组件实例
         * @return {Boolean} 输入域是否注册成功
         * @attention 此方法一般由InputWidget调用
         */
        attach: function (name, component) {
            if (typeof name !== 'string' || !name.length) return false;
            name = component.props.___uitype___ === 'radio' ? name + '___radio___' + component.props.value : name;
            if (this.___inputs___[name]) {
                console.warn('input component with name "' + name + '" already attached');
                return false;
            }
            else {
                this.___inputs___[name] = component;
                return true;
            }
        },

        /**
         * 解除表单输入域
         * @interface detach
         * @param {String} name 输入域名称
         * @param {ReactComponent} component 输入域React组件实例
         * @attention 此方法一般由InputWidget调用
         */
        detach: function (name, component) {
            name = component.props.___uitype___ === 'radio' ? name + '___radio___' + component.props.value : name;
            delete this.___inputs___[name];
        },

        /**
         * 更新表单域
         * @interface updateField
         * @param {String} field 域名称
         * @param {String | Boolean | Number} value 域的新值
         * @param {ReactComponent} component 触发更新的React输入组件
         * @attention 此方法一般由InputWidget触发，并会触发表单onFieldChange事件
         */
        updateField: function (field, value, component) {
            var inputs = this.___inputs___;
            var dataset = {};
            var validationResults = {};
            var componentKey = component.props.___uitype___ === 'radio'
                ? field + '___radio___' + component.props.value : field;
            value = component.props.___uitype___ === 'radio' ? component.props.value : value;

            // 阻断数据流，呵呵，貌似必须阻断，因为暂时没有想好form的定位，先阻断吧
            if (!inputs[componentKey] || dataset[field] === value) return;

            // 赋值
            dataset[field] = value;

            // 域校验
            validationResults[field] = inputs[componentKey].validate(undefined, value);
            inputs[componentKey].setState({isValid: validationResults[field].length < 1});

            // 通知外部
            this.props.onFieldChange({
                targetCompontent: this,
                field: field,
                dataset: dataset,
                validationResults: validationResults
            });
        },

        /**
         * 校验整个表单
         * @interface validate
         * @return {FormValidationObject} 表单校验结果
         */
        /**
         * @structure FormValidationObject
         * @example
         *  {
         *      dataset: {},
         *      fieldResult: {},
         *      formResult: [],
         *      isValid: true
         *  }
         * @param {Object} dataset Form数据集，以输入域name为key
         * @param {Object} fieldResult 域校验结果，以输入域name为key，值为数组，存放该域所有校验错误结果
         * @param {Array.<string>} formResult 表单级别校验结果集
         * @param {Boolean} isValid 表单是否通过了校验，只有所有域和Form级别校验都通过，此项才为true，否则为false
         */
        validate: function () {
            var inputs = this.___inputs___;
            var dataset = {};
            var fieldResult = {};
            var formResult = [];
            var isValid = true;
            // 获取并校验每个域的值，存储值和校验结果
            for (var field in inputs) {
                dataset[field] = inputs[field].___getValue___();
                fieldResult[field] = inputs[field].validate(null, dataset[field]);
                inputs[field].setState({isValid: fieldResult[field].length < 1});
                isValid = isValid && fieldResult[field].length < 1;
            }
            dataset = tools.mergeRadioDataset(dataset);
            fieldResult = tools.mergeRadioValidationResults(fieldResult);
            // 表单级别校验
            for (var key in this.props.validations) {
                if (typeof this.props.validations[key] !== 'function') continue;
                var result = this.props.validations[key](dataset);
                if (result === true) continue;
                isValid = false;
                formResult.push(result);
            }
            return {
                dataset: dataset,
                fieldResult: fieldResult,
                formResult: formResult,
                isValid: isValid
            };
        },
        submit: function (event) {
            event && event.preventDefault();
            var validationResults = this.validate();
            var validations = validationResults.fieldResult;
            validations.form = validationResults.formResult;
            var callbackParam = {
                targetCompontent: this,
                isValid: validationResults.isValid,
                dataset: validationResults.dataset,
                validationResults: validations
            };
            typeof this.props.onFieldChange === 'function' && this.props.onFieldChange(callbackParam);
            if (callbackParam.isValid) {
                typeof this.props.onFieldChange === 'function' && this.props.onSubmit(validationResults.dataset);
            }
        }
    });

});
