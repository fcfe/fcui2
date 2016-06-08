/**
 * 搜索框
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
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueLink valueTemplate
         * @param {Function} onClick 搜索按钮点击时的回调
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
            valueTemplate: React.PropTypes.string,
            onClick: React.PropTypes.func
        },
        // @override
        mixins: [InputWidget, InputWidgetImeFixed],
        // @override
        getDefaultProps: function () {
            return {
                // 样式属性
                skin: '',
                className: '',
                style: {},
                disabled: false,
                placeholder: '',
                valueTemplate: '',
                onClick: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        onButtonClick: function (e) {
            e.target = this.refs.container;
            e.target.value = this.___getValue___();
            this.props.onClick(e);
        },
        focus: function () {
            this.refs.inputbox.focus();
        },
        render: function () {
            var value = this.___getValue___();
            value = value === undefined || value == null ? '' : (value + '');
            var width = cTools.getValueFromPropsAndStyle(this.props, 'width', 200);
            width = isNaN(width) ? 200 : +width;
            var containerProp = cTools.containerBaseProps('searchbox', this, {
                style: {width: width}
            });
            var placeholderProp = {
                className: 'placeholder',
                style: {
                    visibility: value && value.length ? 'hidden' : 'visible'
                }
            };
            var inputProp = {
                ref: 'inputbox',
                type: 'text',
                disabled: this.props.disabled,
                style: {width: width - 30},
                onCompositionStart: this.___onCompositionStart___,
                onCompositionEnd: this.___onCompositionEnd___,
                onKeyUp: this.___onKeyUp___,
                onPaste: this.___onPaste___
            };
            return (
                <div {...containerProp}>
                    <div {...placeholderProp}>{this.props.placeholder}</div>
                    <input {...inputProp}/>
                    <div className="font-icon font-icon-search" onClick={this.onButtonClick}></div>
                </div>
            );
        }
    });


});
