/**
 * @file 表单组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */

define(function (require) {


    var React = require('react');
    var tools = require('./core/formTools');


    return React.createClass({


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
                validations: {},            // 表单级别的校验，比如判断“密码确认”和“密码”是否一致
                onSubmit: function () {},   // 返回正确的表单信息
                onFieldChange: function () {} // 返回实时输入信息和校验信息
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


        // 注册表单域
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


        // 解除表单域
        detach: function (name, component) {
            name = component.props.___uitype___ === 'radio' ? name + '___radio___' + component.props.value : name;
            delete this.___inputs___[name];
        },


        // 更新表单域
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
                field: field,
                dataset: dataset,
                validationResults: validationResults
            });
        },


        submit: function (event) {
            event && event.preventDefault();
            var inputs = this.___inputs___;
            var dataset = {};
            var validationResults = {};
            var formValidationResult = true;

            // 获取并校验每个域的值，存储值和校验结果
            for (var field in inputs) {
                dataset[field] = inputs[field].___getValue___();
                validationResults[field] = inputs[field].validate(null, dataset[field]);
                inputs[field].setState({isValid: validationResults[field].length < 1});
                formValidationResult = formValidationResult && validationResults[field].length < 1;
            }
            dataset = tools.mergeRadioDataset(dataset);
            validationResults = tools.mergeRadioValidationResults(validationResults);
            if (!formValidationResult) {
                this.props.onFieldChange({
                    isValid: false,
                    dataset: dataset,
                    validationResults: validationResults
                });
                return;
            }

            // 表单级别校验
            formValidationResult = [];
            for (var key in this.props.validations) {
                if (typeof this.props.validations[key] !== 'function') continue;
                var result = this.props.validations[key](dataset);
                if (result === true) continue;
                formValidationResult.push(result);
            }
            validationResults.form = formValidationResult;

            // 派发
            var callbackParam = {
                isValid: formValidationResult.length === 0,
                dataset: dataset,
                validationResults: validationResults
            };
            this.props.onFieldChange(callbackParam);
            this.props.onSubmit(dataset);
        }
    });

});
