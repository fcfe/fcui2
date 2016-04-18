/**
 * @file 数字输入框组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.1
 */
define(function (require) {


    var React = require('react');
    var InputWidgetBase = require('./mixins/InputWidgetBase');
    var InputWidgetInForm = require('./mixins/InputWidgetInForm');
    var util = require('./core/util');


    return React.createClass({
        // @override
        mixins: [InputWidgetBase, InputWidgetInForm],
        // @override
        getDefaultProps: function () {
            return {
                className: '',
                width: 60,
                max: Number.POSITIVE_INFINITY,
                min: Number.NEGATIVE_INFINITY,
                step: 1.00,
                type: 'float', // int, float
                fixed: Number.POSITIVE_INFINITY,
                valueTemplate: 0,
                disabled: false,
                showSpinButton: true
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        changeHandler: function (e) {
            if (this.props.disabled) return;
            e.target.value = numberFormater(e.target.value, this.props);
            this.___dispatchChange___(e);
        },
        spinButtonHandler: function (e) {
            if (
                this.props.disabled
                || isNaN(this.refs.inputbox.value)
                || this.refs.inputbox.value.length === 0
            ) {
                return;
            }
            var dataset = util.getDataset(e.target);
            var op = dataset.uiCmd === 'add' ? 1 : -1;
            var target = this.refs.inputbox;
            var value = parseFloat(target.value);
            target.value = value + op * parseFloat(this.props.step);
            e.target = target;
            this.___dispatchChange___(e);
        },
        focus: function () {
            this.refs.inputbox.focus();
        },
        render: function () {
            var value = this.___getValue___();
            var containerProp = {
                className: 'fcui2-numberbox ' + this.props.className,
                style: {width: this.props.width}
            };
            var inputProp = {
                type: 'text',
                value: numberFormater(value, this.props),
                style: {
                    width: this.props.width - (this.props.showSpinButton ? 40 : 20) - 1 
                },
                onChange: this.changeHandler
            };
            this.___mergeInputHandlers___(inputProp, this.props);
            var btnContainerProp = {
                className: 'btn-container',
                style: {
                    display: this.props.showSpinButton ? 'block' : 'none'
                }
            };
            if (this.props.disabled) {
                containerProp.className += ' fcui2-numberbox-disabled'
            }
            else if (this.state.isValid === false) {
                containerProp.className += ' fcui2-numberbox-reject'
            }
            return (
                <div {...containerProp}>
                    <div {...btnContainerProp}>
                        <div className="font-icon font-icon-largeable-caret-up"
                            data-ui-cmd="add" onClick={this.spinButtonHandler}></div>
                        <div className="font-icon font-icon-largeable-caret-down"
                            data-ui-cmd="sub" onClick={this.spinButtonHandler}></div>
                    </div>
                    <input {...inputProp} disabled={this.props.disabled} ref="inputbox"/>
                </div>
            );
        }
    });


    function numberFormater(value, config) {

        value = value + '';
        if (value.length === 0) return value;

        // 分析并过滤掉非法字符
        var str = '-.0123456789';
        var result = '';
        for (var i = 0; i < value.length; i++) {
            var char = value.charAt(i);
            if (
                str.indexOf(char) < 0
                || (char === '-' && i > 0)
                || (char === '.' && result.indexOf('.') > -1)
            ) {
                continue;
            }
            result += char;
        }
        if (result === '-' || result === '.') return result;

        // 检查是否在区间范围内
        value = result;
        result = parseFloat(result);
        if (isNaN(result)) return '';
        var max = parseFloat(config.max);
        var min = parseFloat(config.min);
        result = result > max ? value = max : result;
        result = result < min ? value = min : result;

        if (config.type === 'int') return parseInt(result, 10) + '';

        // 检查小数点
        value = value + '';
        var fixed = parseInt(config.fixed, 10);
        var arr = value.split('.').slice(0, 2);
        if (arr[0].length === 0) arr[0] = 0;
        if (arr.length > 1 && arr[1].length > fixed) {
            arr[1] = arr[1].slice(0, fixed);
        }
        return arr.join('.');
    }


});
