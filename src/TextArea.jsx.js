/**
 * 文本域
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {


    var _ = require('underscore');
    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var InputWidgetImeFixed = require('./mixins/InputWidgetImeFixed');
    var InputWidgetImeFixedForPreactIE = require('./mixins/InputWidgetImeFixedForPreactIE');
    var cTools = require('./core/componentTools');
    var util = require('./core/util');

    var isPreactAndIE = typeof React.render === 'function' && util.getBrowserEnterprise() === 'ie';


    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {String} placeholder 文本域中无内容时显示的提示文字
         * @param {Object} inputBoxStyle 输入框中字体的样式
         * @param {Function} onFocus 输入框获取焦点后的回调
         * @param {Function} onBlur 输入框失去焦点后的回调
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueTemplate
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        contextTypes: {
            appSkin: React.PropTypes.string
        },
        // @override
        mixins: isPreactAndIE ? [InputWidget, InputWidgetImeFixedForPreactIE] : [InputWidget, InputWidgetImeFixed],
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
                inputBoxStyle: {},
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
         * 让文本域获得焦点
         * @interface focus
         */
        focus: function () {
            this.refs.inputbox.focus();
            this.setState({hasFocus: true});
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
                style: _.extend({}, this.props.inputBoxStyle, {
                    width: width - 22,
                    height: height - 22
                })
            };
            if (isPreactAndIE) {
                _.extend(inputProp, {
                    onCompositionStart: this.___onCompositionStart___,
                    onCompositionEnd: this.___onCompositionEnd___,
                    onKeyUp: this.___onKeyUp___
                });
            }
            else {
                _.extend(inputProp, {
                    onCompositionStart: this.___onCompositionStart___,
                    onCompositionEnd: this.___onCompositionEnd___,
                    onKeyUp: this.___onKeyUp___,
                    onFocus: this.___onFocus___,
                    onBlur: this.___onBlur___,
                    onInput: this.___onInput___
                });
            }
            // 由于IE和Chrome下placeholder表现不一致，所以自己做IE下得到焦点后，placeholder会消失，chrome不会
            var labelProp = {
                style: {
                    visibility: ((value && value.length) || this.state.hasFocus) ? 'hidden' : 'visible'
                }
            };
            return (
                <div {...containerProp}>
                    <div {...labelProp}>{this.props.placeholder}</div>
                    <textarea {...inputProp}></textarea>
                </div>
            );
        }
    });
});
