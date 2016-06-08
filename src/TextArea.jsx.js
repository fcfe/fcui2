/**
 *  文本域
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
         * @param {String} placeholder 文本域中无内容时显示的提示文字
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueLink valueTemplate
         */
        // @override
        propTypes: {
            // base
            skin: React.PropTypes.string,
            className: React.PropTypes.string,
            style: React.PropTypes.object,
            disabled: React.PropTypes.bool,
            // self
            placeholder: React.PropTypes.string,
            // mixin
            value: React.PropTypes.string,
            valueLink: React.PropTypes.object,
            name: React.PropTypes.string,
            onChange: React.PropTypes.func,
            validations: React.PropTypes.object,
            customErrorTemplates: React.PropTypes.object,
            valueTemplate: React.PropTypes.string
        },
        // @override
        mixins: [InputWidget, InputWidgetImeFixed],
        // @override
        getDefaultProps: function () {
            return {
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
        /**
         * 让文本域获得焦点
         * @interface focus
         */
        focus: function () {
            this.refs.inputbox.focus();
        },
        render: function () {
            var value = this.___getValue___();
            value = value === undefined || value == null ? '' : (value + '');
            var width = cTools.getValueFromPropsAndStyle(this.props, 'width', 400);
            var height = cTools.getValueFromPropsAndStyle(this.props, 'height', 300);
            width = isNaN(width) ? 400 : +width;
            height = isNaN(height) ? 300 : +height;
            var containerProp = cTools.containerBaseProps('textarea', this, {
                style: {
                    width: width,
                    height: height
                }
            })
            var inputProp = {
                ref: 'inputbox',
                disabled: this.props.disabled,
                spellCheck: false,
                // 其实不应该这样写，可是textarea的padding和border会导致整体尺寸变大
                style: {
                    width: width - 22,
                    height: height - 22
                },
                onCompositionStart: this.___onCompositionStart___,
                onCompositionEnd: this.___onCompositionEnd___,
                onKeyUp: this.___onKeyUp___,
                onPaste: this.___onPaste___
            };
            // 由于IE和Chrome下placeholder表现不一致，所以自己做IE下得到焦点后，placeholder会消失，chrome不会
            var labelProp = {
                style: {
                    visibility: value && value.length ? 'hidden' : 'visible'
                }
            };
            return (
                <div {...containerProp}>
                    <div {...labelProp}>{this.props.placeholder}</div>
                    <textarea {...inputProp}/>
                </div>
            );
        }
    });
});
