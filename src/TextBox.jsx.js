/**
 * 文本输入框
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var InputWidgetImeFixed = require('./mixins/InputWidgetImeFixed');
    var cTools = require('./core/componentTools');


    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {String} placeholder 文本框中无内容时显示的提示文字
         * @param {Function} onFocus 输入框获取焦点后的回调
         * @param {Function} onBlur 输入框失去焦点后的回调
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueTemplate
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        // @override
        mixins: [InputWidget, InputWidgetImeFixed],
        // @override
        getDefaultProps: function () {
            return {
                // base
                skin: '',
                className: '',
                style: {},
                disabled: false,
                // self
                placeholder: '',
                // mixin
                valueTemplate: ''
            };
        },
        // @override
        getInitialState: function () {
            return {
                hasFocus: false
            };
        },
        /**
         * 让输入框获得焦点
         * @interface focus
         */
        focus: function () {
            this.refs.inputbox.focus();
            this.setState({hasFocus: true});
        },
        render: function () {
            var value = this.___getValue___();
            value = value === undefined || value == null ? '' : (value + '');
            var width = cTools.getValueFromPropsAndStyle(this.props, 'width', 200);
            width = isNaN(width) ? 200 : +width;
            var containerProp = cTools.containerBaseProps('textbox', this, {
                style: {width: width}
            });
            var placeholderProp = {
                style: {
                    visibility: ((value && value.length) || this.state.hasFocus) ? 'hidden' : 'visible'
                }
            };
            var inputProp = {
                ref: 'inputbox',
                disabled: this.props.disabled,
                type: 'text',
                style: {width: width - 22},
                onCompositionStart: this.___onCompositionStart___,
                onCompositionEnd: this.___onCompositionEnd___,
                onFocus: this.___onFocus___,
                onBlur: this.___onBlur___,
                onKeyUp: this.___onKeyUp___,
                onPaste: this.___onPaste___
            };
            return (
                <div {...containerProp}>
                    <div {...placeholderProp}>{this.props.placeholder}</div>
                    <input {...inputProp}/>
                </div>
            );
        }
    });


});
