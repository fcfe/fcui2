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
    var Button = require('./Button.jsx');


    return React.createClass({
        /**
         * @properties
         *
         * @param {Import|Properties} src\core\componentTools.js skin className style disabled
         * @param {String} placeholder 文本框中无内容时显示的提示文字
         * @param {String} mode 搜索组件模式，withButton为带button的搜索框
         * @param {Function} onFocus 输入框获取焦点后的回调
         * @param {Function} onBlur 输入框失去焦点后的回调
         * @param {Import|Properties} src\mixins\InputWidget.js
         *      value onChange name validations customErrorTemplates valueTemplate
         * @param {Function} onClick 搜索按钮点击时的回调
         */
        /**
         * @fire Import src\mixins\InputWidget.js XXX onChange
         */
        /**
         * @fire Import src\Button.jsx.js button onClick
         */
        // @override
        contextTypes: {
            appSkin: React.PropTypes.string
        },
        // @override
        mixins: [InputWidget, InputWidgetImeFixed],
        // @override
        getDefaultProps: function () {
            return {
                // base
                mode: '',
                skin: '',
                className: '',
                style: {},
                disabled: false,
                showClearButton: false,
                // self
                placeholder: '',
                onClick: function () {},
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
        onButtonClick: function (e) {
            if (this.props.disabled) {
                return;
            }
            e = {target: this.refs.container};
            e.target.value = this.___getValue___();
            this.props.onClick(e);
        },
        onClearButtonClick: function (e) {
            e = {target: this.refs.container};
            e.target.value = '';
            this.refs.inputbox.value = '';
            this.refs.inputbox.focus();
            this.___stopBlur___ = true;
            this.___dispatchChange___(e);
            this.props.onClick(e);
        },
        onEnterPress: function () {
            this.onButtonClick({});
        },
        focus: function () {
            this.refs.inputbox.focus();
            this.setState({hasFocus: true});
        },
        render: function () {
            var value = this.___getValue___();
            value = value === undefined || value == null ? '' : (value + '');
            var width = cTools.getValueFromPropsAndStyle(this.props, 'width', 200);
            width = isNaN(width) ? 200 : +width;
            var containerProp = cTools.containerBaseProps('searchbox', this, {
                style: {
                    width: width,
                    marginRight: this.props.mode !== 'withButton' ? 0 : 50
                }
            });
            var placeholderProp = {
                className: 'placeholder',
                style: {
                    visibility: ((value && value.length) || this.state.hasFocus) ? 'hidden' : 'visible'
                }
            };
            var inputWidth = width - 32;
            var inputPaddingRight = 20;
            if (this.props.mode !== 'withButton' && this.state.hasFocus && this.props.showClearButton && value) {
                inputPaddingRight += 20;
                inputWidth -= 20;
            }
            var inputProp = {
                ref: 'inputbox',
                type: 'text',
                disabled: this.props.disabled,
                style: {
                    width: inputWidth,
                    paddingRight: inputPaddingRight
                },
                onCompositionStart: this.___onCompositionStart___,
                onCompositionEnd: this.___onCompositionEnd___,
                onKeyUp: this.___onKeyUp___,
                onFocus: this.___onFocus___,
                onBlur: this.___onBlur___,
                onInput: this.___onInput___
            };
            var searchIconProps = {
                className: 'fcui2-icon fcui2-icon-search',
                onClick: this.onButtonClick 
            };
            var removeIconProps = {
                className: 'fcui2-icon fcui2-icon-remove',
                style: {
                    right: this.props.mode === 'withButton' ? 5 : 25
                },
                onClick: this.onClearButtonClick
            };
            var searchButtonProps = {
                onClick: this.onButtonClick,
                className: 'search-button',
                style: {
                    left: width - 1
                }
            };
            return (
                <div {...containerProp}>
                    <div {...placeholderProp}>{this.props.placeholder}</div>
                    <input {...inputProp}/>
                    {this.state.hasFocus && this.props.showClearButton && value ? <div {...removeIconProps}></div> : null}
                    {this.props.mode === 'withButton' ? null : <div {...searchIconProps}></div>}
                    {this.props.mode === 'withButton' ? <div {...searchButtonProps}>搜索</div> : null}
                </div>
            );
        }
    });


});
