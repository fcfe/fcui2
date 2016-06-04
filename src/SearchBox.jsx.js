/**
 * @file 搜索框组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var InputWidgetImeFixed = require('./mixins/InputWidgetImeFixed');
    var cTools = require('./core/componentTools');


    return React.createClass({
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
