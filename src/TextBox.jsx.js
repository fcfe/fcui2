/**
 * @file 文本输入框组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var InputWidgetStreem = require('./mixins/InputWidgetStreem');
    var cTools = require('./core/componentTools');


    return React.createClass({
        // @override
        mixins: [InputWidget, InputWidgetStreem],
        // @override
        getDefaultProps: function () {
            return {
                // 样式属性
                skin: '',
                className: '',
                style: {},
                disabled: false,
                placeholder: '',
                valueTemplate: ''
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        focus: function () {
            this.refs.inputbox.focus();
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
                    visibility: value && value.length ? 'hidden' : 'visible'
                }
            };
            var inputProp = {
                ref: 'inputbox',
                disabled: this.props.disabled,
                type: 'text',
                style: {width: width - 22},
                onCompositionStart: this.___onCompositionStart___,
                onCompositionEnd: this.___onCompositionEnd___,
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
