/**
 * @file 表单组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */

define(function (require) {


    var React = require('react');


    function mergeRadioDataset(dataset) {
        var obj = {};
        for (var key in dataset) {
            if (key.indexOf('___radio___') < 0) {
                obj[key] = dataset[key];
                continue;
            }
            if (!dataset[key]) continue;
            var arr = key.split('___radio___');
            try {
                obj[arr[0]] = JSON.parse(arr[1]);
            }
            catch (e) {
                obj[arr[0]] = arr[1];
            }
           
        }
        return obj;
    }


    function mergeRadioValidationResults(results) {
        var obj = {};
        for (var key in results) {
            if (key.indexOf('___radio___') < 0) {
                obj[key] = results[key];
                continue;
            }
            var arr = key.split('___radio___');
            obj[arr[0]] = obj[arr[0]] || [];
            obj[arr[0]] = obj[arr[0]].concat(results[key]);
        }
        return obj;
    }


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
            // 存储域实时数
            this.___dataset___ = {};
            // 存储域实时校验结果
            this.___validationResults___ = {};
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
            var dataset = this.___dataset___;
            var validationResults = this.___validationResults___;
            var inputField = field;
            field = component.props.___uitype___ === 'radio' ? field + '___radio___' + component.props.value : field;
            // 阻断数据流，呵呵，貌似必须阻断，因为暂时没有想好form的定位，先阻断吧
            if (!inputs[field] || dataset[field] === value) return;
            // 赋值
            dataset[field] = value;
            // 域校验
            validationResults[field] = inputs[field].validate();
            inputs[field].setState({
                isValid: validationResults[field].length < 1
            });
            dataset = mergeRadioDataset(dataset);
            validationResults = mergeRadioValidationResults(validationResults);
            for (var key in dataset) {
                if (key === inputField) continue;
                delete dataset[key];
                delete validationResults[key];
            }
            // 通知外部
            this.props.onFieldChange({
                field: inputField,
                dataset: dataset,
                validationResults: validationResults
            });
        },


        submit: function (event) {
            event && event.preventDefault();
            var inputs = this.___inputs___;
            var dataset = this.___dataset___;
            var validationResults = this.___validationResults___;
            var formValidationResult = true;
            // 获取并校验每个域的值，存储值和校验结果
            for (var field in inputs) {
                dataset[field] = inputs[field].___getValue___();
                validationResults[field] = inputs[field].validate();
                inputs[field].setState({
                    isValid: validationResults[field].length < 1
                });
                formValidationResult = formValidationResult && validationResults[field].length < 1;
            }
            if (!formValidationResult) {
                this.props.onFieldChange({
                    isValid: false,
                    dataset: mergeRadioDataset(dataset),
                    validationResults: mergeRadioValidationResults(validationResults)
                });
                return;
            }
            // 表单级别校验
            formValidationResult = [];
            for (var key in this.props.validations) {
                if (typeof this.props.validations[key] !== 'function') continue;
                var result = this.props.validations[key](mergeRadioDataset(dataset));
                if (result === true) continue;
                formValidationResult.push(result);
            }
            validationResults.form = formValidationResult;
            if (formValidationResult.length > 0) {
                this.props.onFieldChange({
                    isValid: false,
                    dataset: mergeRadioDataset(dataset),
                    validationResults: mergeRadioValidationResults(validationResults)
                });
                return;
            }
            this.props.onFieldChange({
                isValid: true,
                dataset: mergeRadioDataset(dataset),
                validationResults: mergeRadioValidationResults(validationResults)
            });
            this.props.onSubmit(mergeRadioDataset(dataset));
        }
    });

});
